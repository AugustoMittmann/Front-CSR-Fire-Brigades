import SearchBar from "@/app/home/components/searchbar";
import RedirectButton from "../home/components/redirectButton";

function CampaignsPage() {
    return (
        <section className='section'>
            <div className="title mb-5">
                Campanhas
            </div>
            <div className="mb-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget magna et lorem maximus sagittis a id erat. Class
            </div>
            <SearchBar placeholder="Pesquisar Campanha" />
            <div>
                <RedirectButton icon="localizacaobranco" label="Visualizar Brigadas" variation="orange" />
                <RedirectButton icon="maisbranco" label="Ver Artigos & Notícias" variation="orange" />
            </div>
        </section>
    );
}

export default CampaignsPage;   