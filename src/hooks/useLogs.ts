import { useState, useEffect } from "react";

export interface LogEntry {
    id: string;
    fecha: string;
    usuario: string; // email o nombre de usuario
    accion: string;
    detalles: string;
}

export const useLogs = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("rpy_admin_logs");
        if (stored) {
            setLogs(JSON.parse(stored));
        } else {
            setLogs([]);
        }
    }, []);

    const saveLogs = (newLogs: LogEntry[]) => {
        setLogs(newLogs);
        localStorage.setItem("rpy_admin_logs", JSON.stringify(newLogs));
        window.dispatchEvent(new Event("logs_updated"));
    };

    useEffect(() => {
        const handleSync = () => {
            const stored = localStorage.getItem("rpy_admin_logs");
            if (stored) setLogs(JSON.parse(stored));
        };
        window.addEventListener("logs_updated", handleSync);
        return () => window.removeEventListener("logs_updated", handleSync);
    }, []);

    const addLog = (usuario: string, accion: string, detalles: string) => {
        const newLog: LogEntry = {
            id: Date.now().toString(),
            fecha: new Date().toISOString(),
            usuario,
            accion,
            detalles
        };
        saveLogs([newLog, ...logs]);
    };

    return {
        logs,
        addLog
    };
};
