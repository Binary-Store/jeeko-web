export default function About() {
  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl text-center font-bold">About Us</h2>
        <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We are passionate about creating exceptional experiences and
          delivering innovative solutions that make a difference in people's
          lives.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-600">
            To empower individuals and businesses through cutting-edge
            technology solutions while maintaining the highest standards of
            quality and customer satisfaction.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
          <p className="text-gray-600">
            To become the leading innovator in our industry, setting new
            standards for excellence and creating lasting positive impact in the
            communities we serve.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="mb-16">
        <h3 className="text-3xl font-semibold text-center mb-8">
          Our Core Values
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Innovation</h4>
            <p className="text-gray-600">
              Constantly pushing boundaries and embracing new ideas
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Excellence</h4>
            <p className="text-gray-600">
              Delivering the highest quality in everything we do
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Integrity</h4>
            <p className="text-gray-600">
              Operating with honesty and transparency in all we do
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h3 className="text-3xl font-semibold text-center mb-8">Our Team</h3>
        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((member) => (
            <div key={member} className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-semibold mb-1">
                Team Member {member}
              </h4>
              <p className="text-gray-600">Position</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="text-center bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Want to Know More?</h3>
        <p className="text-gray-600 mb-6">
          We'd love to hear from you and answer any questions you may have.
        </p>
        <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Contact Us
        </button>
      </div>
    </section>
  );
}
