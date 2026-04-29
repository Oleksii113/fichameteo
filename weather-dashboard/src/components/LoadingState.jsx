/**
 * Objetivo deste snippet:
 * 1) Mostrar a versão completa desta fase do projeto.
 * 2) Preservar a ordem recomendada: imports -> helpers -> lógica -> export.
 * 3) Permitir cópia direta sem faltar peças de integração.
 *
 * Como ler este bloco:
 * - Começa nos imports (dependências).
 * - Depois valida funções auxiliares e estado.
 * - Só no fim analisa o render/retorno e o export default.
 */
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingState({ label = "A carregar dados meteorológicos..." }) {
    return (
        <div className="loading-state" role="status" aria-live="polite">
            <div className="state-title">
                <AiOutlineLoading3Quarters
                    className="state-icon state-icon--spin"
                    aria-hidden="true"
                />
                <strong>{label}</strong>
            </div>
        </div>
    );
}

export default LoadingState;