const Toaster = ({ message, visible }) => {
  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-in-out z-50 ${
        visible ? "translate-y-10 opacity-100" : "-translate-y-20 opacity-0"
      } bg-gradient-to-r from-purple-400 to-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg`}
    >
      {message}...
    </div>
  );
};

export default Toaster;
