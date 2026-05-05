import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { selectCartSubtotal, useCart } from '@/store/cart';
import { productById } from '@/data/products';
import { Image } from '@/components/ui/Image';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { formatPrice } from '@/lib/format';

export default function Cart() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectCartSubtotal);

  const shipping = subtotal > 0 ? (subtotal > 199 ? 0 : 9.99) : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-ikea-gray-400" aria-hidden />
        <h1 className="mt-4 text-3xl font-bold">Your bag is empty</h1>
        <p className="mt-2 text-ikea-gray-600">
          Browse our collections to find something you'll love.
        </p>
        <Link to="/" className="btn btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Shopping bag</h1>
      <p className="mt-2 text-sm text-ikea-gray-600">
        {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
      </p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <ul role="list" className="divide-y divide-ikea-gray-200 border-y border-ikea-gray-200">
          {items.map((item) => {
            const product = productById[item.productId];
            if (!product) return null;
            return (
              <li
                key={item.productId}
                className="flex gap-4 py-6 sm:gap-6"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block w-28 shrink-0 sm:w-36"
                >
                  <Image
                    src={product.images[0]}
                    alt={`${product.name} ${product.series}`}
                    aspect="square"
                    rounded
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-base font-semibold hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-ikea-gray-600">
                        {product.series}, {product.description}
                      </p>
                    </div>
                    <p className="text-base font-bold">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => setQuantity(item.productId, q)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="flex items-center gap-1.5 text-sm text-ikea-gray-600 hover:text-ikea-red"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl bg-ikea-gray-50 p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ikea-gray-600">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ikea-gray-600">Estimated shipping</dt>
                <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-ikea-gray-600">
                  Spend {formatPrice(200 - subtotal)} more for free shipping.
                </p>
              )}
            </dl>
            <div className="mt-4 flex justify-between border-t border-ikea-gray-200 pt-4 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button type="button" className="btn btn-primary mt-6 h-12 w-full text-base">
              Continue to checkout
            </button>
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full text-center text-xs text-ikea-gray-600 hover:underline"
            >
              Clear bag
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
