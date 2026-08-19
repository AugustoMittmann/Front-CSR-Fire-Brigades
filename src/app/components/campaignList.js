import { NavigationCard } from "@/app/components/navigationCard";
import Skeleton from "@/app/components/skeleton";

const PLACEHOLDER_IMAGE = "/placeholder-brigade.svg";
const SKELETON_COUNT = 3;

export default function CampaignList({ loading, error, campaigns }) {
    if (loading) {
        return (
            <div className="align-center flex flex-col gap-3 py-5">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <Skeleton
                        key={i}
                        width={360}
                        height={150}
                        radius={8}
                        ariaLabel="Carregando campanha"
                    />
                ))}
            </div>
        );
    }
    if (error) return <p className="py-5" style={{ color: "#C62828" }}>{error}</p>;
    if (!campaigns.length) return <p className="py-5">Nenhuma campanha disponível no momento.</p>;

    return (
        <div className="align-center flex flex-col gap-3 py-5">
            {campaigns.map((c) => (
                <NavigationCard
                    key={c.id}
                    title={c.title}
                    backgroundImage={c.imageUrl || PLACEHOLDER_IMAGE}
                />
            ))}
        </div>
    );
}
