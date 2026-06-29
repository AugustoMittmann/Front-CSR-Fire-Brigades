import SearchBar from "@/app/home/components/searchbar";
import Button from "../components/button";

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
                <Button className="w-full" placeholder="Visualizar Brigadas"></Button>
                <Button className="w-full" placeholder="Ver Artigos & Notícias"></Button>
            </div>
        </section>
    );
}

export default CampaignsPage;   