import ContactForm from '@/components/ContactForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Form Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is a full-stack application built with Next.js frontend and NestJS microservices backend.
            Submit the form below to test the complete flow including email notifications.
          </p>
        </div>
        
        <ContactForm />
        
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Architecture Overview</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Frontend:</strong> Next.js with TypeScript and Tailwind CSS</p>
              <p><strong>Backend:</strong> NestJS microservices with RabbitMQ messaging</p>
              <p><strong>Database:</strong> PostgreSQL for data persistence</p>
              <p><strong>Email Service:</strong> Automated email notifications via SMTP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
