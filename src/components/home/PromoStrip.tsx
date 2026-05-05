import { Truck, RotateCcw, Wrench, Heart } from 'lucide-react';

const items = [
  { Icon: Truck, title: 'Delivery', text: 'Fast home delivery from $9.99' },
  { Icon: Wrench, title: 'Assembly', text: 'In-home assembly available' },
  { Icon: RotateCcw, title: '365-day returns', text: 'Change your mind, no problem' },
  { Icon: Heart, title: 'IKEA Family', text: 'Member-only prices and rewards' },
];

export function PromoStrip() {
  return (
    <section className="container-page mt-16">
      <ul
        role="list"
        className="grid grid-cols-2 gap-4 rounded-2xl bg-ikea-gray-50 p-6 sm:grid-cols-4"
      >
        {items.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
              <Icon className="h-5 w-5 text-ikea-blue" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-ikea-gray-600">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
