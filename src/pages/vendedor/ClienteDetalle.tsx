import { useParams } from "react-router-dom";

export const ClienteDetalle = () => {
    const { id } = useParams();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Detalle de Cliente {id}</h2>
        </div>
    );
};
