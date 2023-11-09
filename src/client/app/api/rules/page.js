import React from 'react';
import Image from 'next/image'; 

export default function Rules_Page() {
  return (
    <section className="bg-whitebg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            The Offical Rules for Rhombichess
          </h2>
          <p className="text-gray-500 sm:text-xl">
          White moves first. Players must checkmate the opposing King to win.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-50 h-50 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/rook-wht.png" alt="rook" width={300} height={200} className="mx-auto"/>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Rook</h3>
            <p className="text-gray-500 text-gray-400">
             Moves in 1 of 4 directions, 1 or more steps in a straight line across rhombuses with a common side. It does not leap.            </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/machine-wht.png" alt="machine" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Machine</h3>
            <p className="text-gray-500 text-gray-400">
            Moves 1 or 2 rhombuses like a Rook but may leap to the second rhombus.  </p>
            </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/bishop-wht.png" alt="bishop" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Bishop</h3>
            <p className="text-gray-500 text-gray-400">
                Moves in 1 of 4 directions, 1 or more steps in a straight line along rhombuses with a common vertex and colour. It does not leap.            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/elephant-wht.png" alt="elphant" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Elephant</h3>
            <p className="text-gray-500 text-gray-400">
             Moves 1 or 2 rhombuses like a Bishop but may leap to the second rhombus. All 3 elephants may escape the initial setup on their first move.            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/jester-wht.png" alt="jester" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Jester</h3>
            <p className="text-gray-500 text-gray-400">
            Moves in 1 of 4 directions, 1 or more steps in a straight line across a vertex of its rhombus. It does not leap.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/dog-wht.png" alt="dog" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Dog</h3>
            <p className="text-gray-500 text-gray-400">
                Moves 1 or 2 rhombuses like a Jester but may leap to the second rhombus. The move across a wide-angle vertex is to 1 rhombus only. All 3 dogs may escape the initial setup on their first move.            </p>
         </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/queen-wht.png" alt="queen" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Queen</h3>
            <p className="text-gray-500 text-gray-400">
            Moves in 1 of 12 directions, 1 or more rhombuses in a straight line like a Rook, Bishop, or Jester. It does not leap. </p>
        </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/mammoth-wht.png" alt="mammoth" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Mammoth</h3>
            <p className="text-gray-500 text-gray-400">
            Moves 1 or 2 rhombuses like a Queen but may leap to the second rhombus. The move across a wide-angle vertex is to 1 rhombus only. </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/cat-wht.png" alt="cat" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Cat</h3>
            <p className="text-gray-500 text-gray-400">
            Moves 2 rhombuses (not 1) like a Queen but may leap. The move across a wide-angle vertex is to 1 rhombus only. All 3 Cats may escape the initial setup on their first move. </p>
            </div>
            <div className="flex flex-col items-center"> 
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/hawk-wht.png" alt="hawk" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Hawk</h3>
            <p className="text-gray-500 text-gray-400">
            Moves 2 or 3 rhombuses (not 1) like a Queen but may leap to them. The move across a wide-angle vertex is to 2 rhombuses only. The Hawk may escape the initial setup on its first move. </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/soldier-wht.png" alt="soldier" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Soldier</h3>
            <p className="text-gray-500 text-gray-400">
            Moves to any rhombus in its 2 regular hexagons. A move in a Rook’s direction may be a leap to the 3rd rhombus away. The left and right Shields may escape the initial setup on their first move. </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/knight-wht.png" alt="knight" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Knight</h3>
            <p className="text-gray-500 text-gray-400">
            Moves (and may leap) 2 rhombuses like a Rook followed by 1 rhombus outwards (at a 1/3 turn, i.e., 120°), or 1 rhombus followed by 2 likewise. A Knight’s move always changes the colour of its rhombus. Both Knights may escape the initial setup on their first move. </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/king-wht.png" alt="king" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">King</h3>
            <p className="text-gray-500 text-gray-400">
            Moves in 1 of 10 directions but only 1 step in any direction and omitting the Queen’s move across a wide-angle vertex. It thus moves 1 step in either of its 2 snowflakes. </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/prince-wht.png" alt="prince" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Prince</h3>
            <p className="text-gray-500 text-gray-400">
            Moves exactly like a King but is not subject to check and may be captured. </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/pawn-wht.png" alt="pawn1" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Pawn 1</h3>
            <p className="text-gray-500 text-gray-400">
            A Pawn always moves to the same type of rhombus and captures going to the other type by step. In their initial positions the Pawns are protected by other Pawns, Soldiers, and pieces farther back.On a vertical rhombus. Moves 1 step forward like a Jester and captures 1 step forward onto the nearest non-vertical rhombuses, contiguous by side or vertex.</p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/pawn-blk.png" alt="pawn2" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Pawn 2</h3>
            <p className="text-gray-500 text-gray-400">
            On a non-vertical rhombus. Moves 1 step forward like a Rook, or 2 such steps if there is no intervening piece. It captures 1 step forward onto the nearest vertical rhombuses, contiguous by side or vertex. (This pawn does not capture in the direction of a Jester or Dog).</p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/soldier-wht.png" alt="soldier1" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Soldier 1</h3>
            <p className="text-gray-500 text-gray-400">
            On a vertical rhombus. Moves and captures like a Pawn on a similar rhombus. Without capturing, it also moves to the rhombuses of capture. </p>
            </div>
            <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-20 lg:w-20 dark:bg-primary-900">
                <Image src="/images/soldier-blk.png" alt="soldier2" width={300} height={200} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Soldier 2</h3>
            <p className="text-gray-500 text-gray-400">
            On a non-vertical rhombus. Moves and captures like a Pawn on a similar rhombus. Without capturing, it also moves to the rhombuses of capture. (This soldier does not capture in the direction of a Jester or Dog). </p>
            </div>
        </div>
        </div>
    </section>
  );
}
