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
import { MdOutlineWarningAmber } from "react-icons/md";

function ErrorState({ message, onRetry }) {
    return (
        <div className="error-state" role="alert">
            <div className="state-title">
                <MdOutlineWarningAmber
                    className="state-icon state-icon--danger"
                    aria-hidden="true"
                />
                <strong>Ocorreu um problema.</strong>
            </div>
            <p>{message}</p>
            <button
                className="error-state__button"
                type="button"
                onClick={onRetry}
            >
                Tentar novamente
            </button>
        </div>
    );
}

export default ErrorState;