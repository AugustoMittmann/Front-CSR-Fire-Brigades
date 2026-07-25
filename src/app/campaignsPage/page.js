'use client'

import { useEffect, useState } from "react";
import SearchBar from "@/app/home/components/searchbar";
import RedirectButton from "../home/components/redirectButton";
import CampaignList from "../components/campaignList";
import { api } from "@/lib/api";

function CampaignsPage() {
    const [search, setSearch] = useState("");
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ctrl = new AbortController();
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.campaigns.list(
                    { limit: 50, search: search || undefined },
                    { signal: ctrl.signal },
                );
                setCampaigns(res?.data ?? []);
            } catch (err) {
                if (err.name === "AbortError") return;
                setError("Não foi possível carregar as campanhas.");
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => ctrl.abort();
    }, [search]);

    return (
        <section className='section'>
            <div className="title mb-5">
                Campanhas
            </div>
            <div className="mb-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget magna et lorem maximus sagittis a id erat. Class
            </div>
            <SearchBar placeholder="Pesquisar Campanha" onSearch={setSearch} />
            <CampaignList
                loading={loading}
                error={error}
                campaigns={campaigns}
            />
            <div>
                <RedirectButton link="/viewBrigadesPage" icon="localizacaobranco" label="Visualizar Brigadas" variation="orange" />
                <RedirectButton link="/viewCampaignsPage"  icon="maisbranco" label="Ver Artigos & Notícias" variation="orange" />
            </div>
        </section>
    );
}

export default CampaignsPage;
