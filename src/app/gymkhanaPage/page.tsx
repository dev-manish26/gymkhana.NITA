import Image from "next/image";
import Tabs from "~/components/tabs";

const executives = [
  { name: "Devanshu Deo", post: "Vice President Boys", photo: "/executives/13.png" },
  { name: "Jagreeti Chakraborty", post: "Vice President Girls", photo: "/executives/14.png" },
  { name: "Ashish Kumar Gautam", post: "Advisory Board", photo: "/executives/15.png" },
  { name: "Shreyash Shetty", post: "Advisory Board", photo: "/executives/16.png" },
  { name: "Srijan Mallick", post: "General Secretary Technical", photo: "/executives/4.png" },
  { name: "Debaditya Roy", post: "Asst. General Secretary Technical", photo: "/executives/5.png" },
  { name: "Diya Choudhary", post: "Asst. General Secretary Technical", photo: "/executives/6.png" },
  { name: "Kuldip Chakraborty", post: "Asst. General Secretary Alumni", photo: "/executives/7.png" },
  { name: "Varun Srivastava", post: "General Secretary Alumni", photo: "/executives/8.png" },
  { name: "Harish Saharan", post: "Asst. General Secretary Alumni", photo: "/executives/9.png" },
  { name: "Soumyadeep Acharya", post: "General Secretary Cultural", photo: "/executives/10.png" },
  { name: "Shruba Das", post: "Asst. General Secretary Cultural", photo: "/executives/11.png" },
  { name: "Yash Alok", post: "Asst. General Secretary Cultural", photo: "/executives/12.png" },
  { name: "Sanapala Venkata Satya Sai Manikanta", post: "General Secretary Sports", photo: "/executives/17.png" },
  { name: "Md. Anans Khan", post: "Asst. General Secretary Sports", photo: "/executives/18.png" },
  { name: "Leela Lakshmi Kundi", post: "Asst. General Secretary Sports", photo: "/executives/19.png" },

];

export default function AboutGymkhana() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* First Row: Gymkhana Info + Gymkhana Bodies */}
      <div className="flex flex-col md:flex-row w-full container mx-auto p-6 gap-6">
        {/* Left Content */}
        <main className="flex-grow md:w-3/4">
          {/* Welcome Section */}
          <section className="mb-7">
            <h2 className="text-3xl font-bold mb-4 text-primary">Welcome to Gymkhana, NIT Agartala</h2>
            <p className="text-gray-700 leading-relaxed">
              The Gymkhana at NIT Agartala is the student-run governing body dedicated to fostering an
              environment of innovation, creativity, and leadership. It serves as the core organization that
              oversees and manages technical, cultural, sports, and student welfare activities on campus.
            </p>
          </section>

          {/* Mission Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-1 text-primary">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We aim to empower students by providing opportunities to learn, lead, and excel beyond academics.
              Through various clubs, fests, and events, Gymkhana nurtures team spirit, creativity, and technical
              excellence, shaping well-rounded individuals ready for the future.
            </p>
          </section>
        </main>

        {/* Right Column: Gymkhana Bodies */}
        <aside className="w-full md:w-1/4 p-6 border-l-2 border-primary bg-white shadow-md self-start">
          <h2 className="text-3xl font-bold mb-4 text-primary">Gymkhana Body</h2>
          <Tabs />
        </aside>
      </div>

      {/* Second Row: Executives Section */}
      <div className="w-full bg-white py-10 shadow-md">
        <section className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-4 text-primary text-center shadow-b-md">Executives</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
            {executives.map((exec, index) => (
                <div
                key={index}
                className="flex flex-col items-center justify-center text-center p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform"
                >
                <Image
                  src={exec.photo}
                  alt={exec.name}
                  width={80}
                  height={80}
                  className="rounded-full shadow-md"
                />
                <p className="mt-2 text-lg font-semibold">{exec.name}</p>
                <p className="text-sm text-gray-600">{exec.post}</p>
                </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
