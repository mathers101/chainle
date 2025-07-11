import { cn } from "../lib/utils";
import { useChainData, useChainApi } from "./ChainContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

interface ChainInputProps {
  index: number;
  revealed: boolean;
}

export default function WordDisplay({ index, revealed }: ChainInputProps) {
  const { status, correctChain, currentChain, solvedByIndex } = useChainData();
  const { selectHintIndex } = useChainApi();

  const isWinner = status === "winner";
  const isLoser = status === "loser";
  const isInitialWord = index === 0 || index === currentChain.length - 1;
  const isSolved = solvedByIndex[index] || false;
  const currentlyRevealed = (isLoser ? correctChain[index] : currentChain[index]) ?? "";

  const isSelectable = status === "selecting" && !isSolved;
  const handleSelect = () => selectHintIndex(index);

  const gameOver = isWinner || isLoser;
  const disabled = gameOver || isSolved;

  const shouldAnimate = revealed && !isInitialWord;

  return (
    <div onClick={isSelectable ? handleSelect : undefined}>
      <InputOTP
        inputMode="text"
        maxLength={10}
        value={currentlyRevealed}
        tabIndex={disabled ? -1 : 0}
        disabled={!isSelectable}
        className={isSelectable ? "cursor-pointer" : "cursor-not-allowed"}
        spellCheck={false}
      >
        <InputOTPGroup
          className={cn(
            "uppercase",
            isWinner ? "animate-bounce" : shouldAnimate ? "animate-vflip backface-hidden" : ""
          )}
        >
          {Array.from({ length: 10 }, (_, letterIndex) => {
            return (
              <InputOTPSlot
                inputMode="text"
                key={letterIndex}
                index={letterIndex}
                className={cn(
                  "border-gray-700",
                  isInitialWord ? "bg-yellow-400/80" : isSolved ? "bg-green-500/90" : gameOver ? "bg-gray-300" : ""
                )}
              />
            );
          })}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
