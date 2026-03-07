import { useParams } from "react-router-dom";

export const PedidoDetalle = () => {
    const { id } = useParams();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Detalle de Pedido {id}</h2>
        </div>
    );
};
