export default function Faqs() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Maithil Milan FAQs
      </h1>

      <section className="mb-8 space-y-8">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>

          <p className="leading-relaxed">
            Maithil Milan is a world-class online matrimony portal exclusively
            for Maithils. We connect Maithils from around the world, helping
            them find their perfect match and stay connected to their roots.
          </p>
        </div>
      </section>

      <section className="mb-8 space-y-8">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Features
          </h2>

          <ul className="space-y-4 list-disc pl-4">
            <li>
              <h3 className="text-lg font-medium">Online Matrimony</h3>

              <p className="leading-relaxed">
                Connect with Maithils from around the world and find your
                perfect match.
              </p>
            </li>

            <li>
              <h3 className="text-lg font-medium">Secure and Private</h3>

              <p className="leading-relaxed">
                Your privacy is our priority, ensuring a safe and secure online
                experience.
              </p>
            </li>

            <li>
              <h3 className="text-lg font-medium">Easy to Use</h3>

              <p className="leading-relaxed">
                Our user-friendly interface makes it easy to navigate and find
                your perfect match.
              </p>
            </li>

            <li>
              <h3 className="text-lg font-medium">Global Community</h3>

              <p className="leading-relaxed">
                Connect with Maithils from around the world and find your
                perfect match.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
