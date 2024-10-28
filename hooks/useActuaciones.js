import { useMemo, useState } from "react";
import { searchAllRepertorios } from "../services/ActuacionesService";

export function useActuaciones() {
	const [actuaciones, setActuaciones] = useState([]);
	const [loading, setLoading] = useState(false);

	const getActuaciones = useMemo(() => {
		return async () => {
			try {
				setLoading(true);
				const newActuaciones = await searchAllRepertorios();
				setActuaciones(newActuaciones);
				setLoading(false);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
	}, [actuaciones]);

	return { actuaciones, getActuaciones, loading };
}
