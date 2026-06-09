
import FAQ from '../FAQPage/components/FAQ'
import styles from "./style.module.css";
import SearchBar from '../home/components/searchbar';
import Button from '../components/button';
import Image from 'next/image'
import Table from '../components/table';

const columns = ["Item", "Qtd.", "Valor estimado"];
const rows = [
  ["Item 1", "999", "R$99999,99"],
  ["Item 1", "999", "R$99999,99"],
  ["Item 1", "999", "R$99999,99"],
  ["Item 1", "999", "R$99999,99"],
  ["Item 1", "999", "R$99999,99"],
];

function BrigadesProfilePage() {
  return (
    <>
      <section className='section'>
        <div className='title'>
          Acompanhe o Trabalho da Brigada Florestal JM
        </div>
        <div className='mb-2'>
          <Image className='rounded' width={350} height={250} src="/images/brigade.png" alt="Brigada Image" />
        </div>
        <div>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <span className='text-orange-400 font-bold'>Fundada em</span>
              <span>01.01.2020</span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-orange-400 font-bold'>Áreas de Atuação</span>
              <span>Combate a incêndios florestais</span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-orange-400 font-bold'>Número de Voluntários</span>
              <span>123</span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-orange-400 font-bold'>Localização</span>
              <span>
                Rua Santa Lúcia, 385 - Bairro Aclimação,
                João Monlevade - MG
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-orange-400 font-bold'>Instagram</span>
              <span>@brigadaflorestaljm</span>
            </div>
          </div>
        </div>
      </section>
      <div className='flex bg-green-200 flex-col justify-center align-center gap-3 p-5'>
        <h3>Deseja ajudar essa Brigada?</h3>
        <div className='flex flex-col justify-center align-center w-full gap-2'>
          <span>Para doações monetárias de qualquer valor:</span>
          <Button className="w-full justify-center" placeholder="Copiar Chave PIX" />
        </div>
        <div className='flex flex-col justify-center align-center w-full gap-2'>
          <span>Para doação de itens ou voluntariado:</span>
          <Button className="w-full justify-center" placeholder="Entrar em Contato" style="standard" />
        </div>
      </div>
      <div className='p-5 bg-gray-200'>
        <h3 className='mb-2'>Principais Atividades Desenvolvidas</h3>
        <div className='flex flex-col gap-1'>
          <div className='flex gap-1'>
            <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
              Educação Ambiental
            </div>
            <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
              Monitoramento
            </div>
          </div>
          <div className='flex gap-1'>
            <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
              Queimas Prescritas
            </div>
            <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
              Restauração
            </div>
          </div>
          <div className='flex gap-1'>
            <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
              Prevenção
            </div>
            <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
              Combate
            </div>
          </div>
          <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
            Elaboração de planos preventivos
          </div>
          <div className='font-normal bg-white bc-green-400 rounded-sm text-sm p-10 border-solid-1 flex-item text-center'>
            Elaboração de planos operativos
          </div>
        </div>
      </div>
      <div className='bg-white p-5'>
        <h3 className='mb-2'>Apresentação</h3>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget magna et lorem maximus sagittis a id erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent leo nisi, blandit vitae tincidunt vel, dapibus in urna. Integer aliquam tortor a arcu sagittis, non pellentesque mauris volutpat. Maecenas egestas fermentum tristique. Ut interdum leo ac orci accumsan facilisis. Sed facilisis, odio in sagittis auctor, nulla ex fringilla quam, tristique bibendum lacus nulla nec sapien. Phasellus eu elit mi. Pellentesque a odio enim. Etiam in efficitur ipsum. Nam lobortis bibendum metus sed tristique. Class aptent taciti sociosqu ad litora torquent
        </div>
      </div>
      <div className='bg-gray-200 p-5'>
        <h3 className='mb-2'>Sugestão de Doação</h3>
        <div className='mb-2'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget magna et lorem maximus sagittis a id erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
        </div>
        <Table rows={rows} columns={columns} />
      </div>
    </>
  );
}

export default BrigadesProfilePage