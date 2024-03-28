import React from 'react';
import Image from 'next/image';

export default function RulesPage() {
  return (
    <section className="bg-white mt-24 sm:mt-0">
      <div className="m-6 mb-32 max-w-full sm:m-16">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            The Offical Rules for RhombiChess
          </h2>
          <p className="text-gray-500 sm:text-xl">
            White moves first. Players must checkmate the opposing King to win.
            When a White Pawn or Soldier reaches row 30 or beyond,
            or a Black Pawn or Soldier reaches row 8 or beyond,
            it must be promoted to any piece except those or a King.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-12 md:space-y-0">
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/rook-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Rook</h3>
            </div>
            <p className="text-gray-500">
              Moves in 1 of 4 directions,
              1 or more steps in a straight line across rhombuses with a common side.
              It does not leap.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/machine-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Machine</h3>
            </div>
            <p className="text-gray-500">
              Moves 1 or 2 rhombuses like a Rook but may leap to the second rhombus.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/bishop-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Bishop</h3>
            </div>
            <p className="text-gray-500">
              Moves in 1 of 4 directions,
              1 or more steps in a straight line along rhombuses with a common vertex and colour.
              It does not leap.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/elephant-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Elephant</h3>
            </div>
            <p className="text-gray-500">
              Moves 1 or 2 rhombuses like a Bishop but may leap to the second rhombus.
              All 3 elephants may escape the initial setup on their first move.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/jester-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Jester</h3>
            </div>
            <p className="text-gray-500">
              Moves in 1 of 4 directions,
              1 or more steps in a straight line across a vertex of its rhombus.
              It does not leap.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/dog-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Dog</h3>
            </div>
            <p className="text-gray-500">
              Moves 1 or 2 rhombuses like a Jester but may leap to the second rhombus.
              The move across a wide-angle vertex is to 1 rhombus only.
              All 3 dogs may escape the initial setup on their first move.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/queen-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Queen</h3>
            </div>
            <p className="text-gray-500">
              Moves in 1 of 12 directions,
              1 or more rhombuses in a straight line like a Rook, Bishop, or Jester.
              It does not leap.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/mammoth-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Mammoth</h3>
            </div>
            <p className="text-gray-500">
              Moves 1 or 2 rhombuses like a Queen but may leap to the second rhombus.
              The move across a wide-angle vertex is to 1 rhombus only.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/cat-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Cat</h3>
            </div>
            <p className="text-gray-500">
              Moves 2 rhombuses (not 1) like a Queen but may leap.
              The move across a wide-angle vertex is to 1 rhombus only.
              All 3 Cats may escape the initial setup on their first move.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/hawk-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Hawk</h3>
            </div>
            <p className="text-gray-500">
              Moves 2 or 3 rhombuses (not 1) like a Queen but may leap to them.
              The move across a wide-angle vertex is to 2 rhombuses only.
              The Hawk may escape the initial setup on its first move.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/shield-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Shield</h3>
            </div>
            <p className="text-gray-500">
              Moves to any rhombus in its 2 regular hexagons.
              A move in a Rook&apos;s direction may be a leap to the 3rd rhombus away.
              The left and right Shields may escape the initial setup on their first move.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/knight-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Knight</h3>
            </div>
            <p className="text-gray-500">
              Moves (and may leap) 2 rhombuses like a Rook
              followed by 1 rhombus outwards (at a 1/3 turn, i.e., 120°),
              or 1 rhombus followed by 2 likewise.
              A Knight&apos;s move always changes the colour of its rhombus.
              Both Knights may escape the initial setup on their first move.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/king-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">King</h3>
            </div>
            <p className="text-gray-500">
              Moves in 1 of 10 directions but only 1 step in any direction
              and omitting the Queen&apos;s move across a wide-angle vertex.
              It thus moves 1 step in either of its 2 snowflakes.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/prince-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Prince</h3>
            </div>
            <p className="text-gray-500">
              Moves exactly like a King but is not subject to check and may be captured.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/pawn-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Pawn Type-1</h3>
            </div>
            <p className="text-gray-500">
              A Pawn always moves to the same type of rhombus and captures
              going to the other type by step.
              In their initial positions the Pawns are protected by
              other Pawns, Soldiers, and pieces farther back.On a vertical rhombus.
              Moves 1 step forward like a Jester and captures 1 step forward
              onto the nearest non-vertical rhombuses, contiguous by side or vertex.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/pawn-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Pawn Type-2</h3>
            </div>
            <p className="text-gray-500">
              On a non-vertical rhombus. Moves 1 step forward like a Rook,
              or 2 such steps if there is no intervening piece.
              It captures 1 step forward onto the nearest vertical rhombuses,
              contiguous by side or vertex.
              (This pawn does not capture in the direction of a Jester or Dog).
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/soldier-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Soldier Type-1</h3>
            </div>
            <p className="text-gray-500">
              On a vertical rhombus.
              Moves and captures like a Pawn on a similar rhombus.
              Without capturing, it also moves to the rhombuses of capture.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full sm:w-fit items-center justify-start gap-4 sm:flex-col sm:gap-3 mb-4 sm:mb-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-full lg:h-15 lg:w-15 bg-gray-800">
                <Image src="/pieces/soldier-white.png" alt="machine" width={300} height={200} />
              </div>
              <h3 className="sm:mb-2 text-xl font-bold text-gray-900">Soldier Type-2</h3>
            </div>
            <p className="text-gray-500">
              On a non-vertical rhombus.
              Moves and captures like a Pawn on a similar rhombus.
              Without capturing, it also moves to the rhombuses of capture.
              (This soldier does not capture in the direction of a Jester or Dog).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
