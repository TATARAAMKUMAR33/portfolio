import { SUBSCRIPTION_PLANS, PAYMENT_INFO, SITE } from '../data/siteConfig'
import { Link } from 'react-router-dom'

export default function SubscribePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="section-title mb-3">Subscribe to Intelligence</h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-sub)' }}>
          Get full access to live trackers, premium research briefs, and monthly
          intelligence briefings covering India — from central government to panchayat level.
        </p>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {SUBSCRIPTION_PLANS.map(plan => (
          <div key={plan.id}
            className={`card p-6 flex flex-col ${plan.featured ? 'ring-2 ring-yellow-400 relative' : ''}`}>
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge badge-premium text-xs px-3 py-1">Most Popular</span>
              </div>
            )}
            <h3 className="font-bold text-base mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {plan.priceINR === 0 ? 'Free' : `Rs. ${plan.priceINR}`}
              </span>
              {plan.priceINR !== 0 && !plan.oneTime && (
                <span className="text-sm text-gray-400 ml-1">
                  / {plan.id.includes('annual') ? 'year' : 'month'}
                </span>
              )}
              {plan.oneTime && (
                <span className="text-sm text-gray-400 ml-1">one-time</span>
              )}
              {plan.priceUSD !== 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  ~$ {plan.priceUSD} {plan.oneTime ? '' : plan.id.includes('annual') ? '/year' : '/month'}
                </div>
              )}
            </div>
            <ul className="text-sm space-y-2 mb-6 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span style={{ color: 'var(--color-text-sub)' }}>{f}</span>
                </li>
              ))}
            </ul>
            {plan.priceINR === 0 ? (
              <Link to="/library" className="btn-outline text-sm text-center block">
                {plan.cta}
              </Link>
            ) : (
              <a href={`mailto:${SITE.email}?subject=Subscribe — ${plan.name}&body=Hi TATA, I would like to subscribe to the ${plan.name} plan.`}
                 className="btn-primary text-sm text-center block">
                {plan.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="card p-8 mb-10">
        <h2 className="font-bold text-xl mb-6 text-center">Payment Methods</h2>
        <div className="grid sm:grid-cols-3 gap-6">

          {/* Razorpay */}
          <div className="text-center">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="font-semibold mb-1">Razorpay</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-sub)' }}>
              UPI, Cards, Net Banking — all Indian payment methods
            </p>
            <a href={`mailto:${SITE.email}?subject=Payment via Razorpay`}
               className="btn-outline text-xs">
              Get Razorpay Link
            </a>
          </div>

          {/* Bank Transfer */}
          {PAYMENT_INFO.bank.enabled && (
            <div className="text-center">
              <div className="text-4xl mb-3">🏦</div>
              <h3 className="font-semibold mb-1">Bank Transfer / UPI</h3>
              <div className="text-sm space-y-1 mt-2" style={{ color: 'var(--color-text-sub)' }}>
                <p><span className="font-medium">Name:</span> {PAYMENT_INFO.bank.name}</p>
                <p><span className="font-medium">Bank:</span> {PAYMENT_INFO.bank.bank}</p>
                <p><span className="font-medium">A/C:</span> {PAYMENT_INFO.bank.account}</p>
                <p><span className="font-medium">IFSC:</span> {PAYMENT_INFO.bank.ifsc}</p>
                <p><span className="font-medium">UPI:</span> {PAYMENT_INFO.bank.upi}</p>
              </div>
            </div>
          )}

          {/* Stripe / International */}
          <div className="text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-semibold mb-1">International (Stripe)</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-sub)' }}>
              USD, EUR, GBP, SGD and more — for clients outside India
            </p>
            <a href={`mailto:${SITE.email}?subject=International Payment`}
               className="btn-outline text-xs">
              Request Stripe Link
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }}>
          After payment, send confirmation to{' '}
          <a href={`mailto:${SITE.email}`} className="font-semibold hover:underline"
             style={{ color: 'var(--color-accent)' }}>
            {SITE.email}
          </a>{' '}
          — access unlocked within 2 hours.
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-sub)' }}>
          Need a custom plan, institutional access, or a sector-specific brief?
        </p>
        <Link to="/contact" className="btn-primary text-sm">Talk to TATA →</Link>
      </div>
    </div>
  )
}
