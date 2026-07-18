import SearchBar from "@/app/home/components/searchbar";
import RedirectButton from "../home/components/redirectButton";
import { NavigationCard } from "../components/navigationCard";

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
            <div className="flex flex-col gap-3 py-5">
                <NavigationCard />
                <NavigationCard />
                <NavigationCard />
            </div>
            <div>
                <RedirectButton link="/viewBrigadesPage" icon="localizacaobranco" label="Visualizar Brigadas" variation="orange" />
                <RedirectButton link="/viewCampaignsPage"  icon="maisbranco" label="Ver Artigos & Notícias" variation="orange" />
            </div>
        </section>
    );
}

export default CampaignsPage;   