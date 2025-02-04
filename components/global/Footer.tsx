const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-4 sticky bottom-0">
      <div className="container mx-auto px-4">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Marty Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
