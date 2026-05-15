import notFound from "/assets/notFound.optimized.png";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <img src={notFound} alt="Not Found" className="w-200" />
    </div>
  );
}

export default NotFound;
