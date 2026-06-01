import Icons from "../../constants/icons";
import Image from "next/image";

export default function HelpButton() {
  return (
    <button
      type="button"
      aria-label="Abrir ajuda"
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      <Image
        src={Icons.ajudabranco.value}
        alt=""
        height={40}
        width={40}
      />
    </button>
  );
}
