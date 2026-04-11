import Logo from "@/assets/logo.svg";

function LoginBrand() {
  return (
    <div className="flex items-center justify-center gap-3 pt-8 pb-6 md:pt-3 md:pb-3">
      <div className="relative shrink-0">
        <img src={Logo} width={50} height={50} />
      </div>
      <div className="bg-gradient-to-br from-[#2890d4] to-[#00c7d4] bg-clip-text text-3xl font-semibold tracking-[-0.04em] text-transparent md:text-[34px]">
        Mua He Xanh Online
      </div>
    </div>
  );
}

export { LoginBrand };
