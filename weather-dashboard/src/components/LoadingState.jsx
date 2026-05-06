import { AiOutlineLoading3Quarters, AiOutlineloading3Quarters } from "react-icons/ai";

function LoadingState({ label = "A carregar dads meteorologicos..."}) {
    return(
        <div className="loading-state" role="status" aria-live="polite">
            <div className="stte-title">
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