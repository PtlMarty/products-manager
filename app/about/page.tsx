// TODO: Add an about page

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-16 mt-12 h-full">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">About Here</h1>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>
          this application is here to help you manage your Shops, statistics,
          products, suppliers and more.
        </p>
        <p>
          it is a work in progress and I will be adding more features in the
          future.
        </p>
        <p>
          I am a software engineer and I am building this application to help me
          learning Next.js, Tailwind CSS, and TypeScript.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
