import unauthorized from "/assets/unauthorized.png";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <img src={unauthorized} alt="Unauthorized" className="w-200" />
    </div>
  );
}

export default Unauthorized;
