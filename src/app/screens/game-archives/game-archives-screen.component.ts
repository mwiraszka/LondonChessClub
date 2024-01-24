import { Component } from '@angular/core';

import { GameArchivesScreenFacade } from './game-archives-screen.facade';

@Component({
  selector: 'lcc-game-archives-screen',
  templateUrl: './game-archives-screen.component.html',
  styleUrls: ['./game-archives-screen.component.scss'],
  providers: [GameArchivesScreenFacade],
})
export class GameArchivesScreenComponent {
  constructor(public facade: GameArchivesScreenFacade) {}

  pgns = [
    `[Event "USSR Championship"]
    [Site "Moscow URS"]
    [Date "1957.02.21"]
    [Round "21"]
    [White "Mikhail Tal"]
    [Black "Alexander Kazimirovich Tolush"]
    [Result "1-0"]
    [ECO "E81"]
    [Annotator "USER"]
    [PlyCount "83"]
    [EventDate "1957.??.??"]
    
    {Let's start our journey through the imaginative, wonderful world of the games
    of Mikhail Tal by examining his game against the old Soviet Master Alexander
    Kazimirovich Tolush from the 21st USSR Championship, held in 1957. --- Tolush,
    who would later become very famous as one of the trainers of the future World
    Champion Boris Spassky, was very known for his sharp and attacking style - so
    it is not surprising that his games against Mikhail Tal were often a spectacle
    in their own right! --- The two players have already created a mind-boggling
    masterpiece in the 1956 USSR Chess Championship (which will not be analyzed in
    this article, although it was analyzed by Garry Kasparov in his book On My
    Great Predecessors in the chapter about Tal).} 1. c4 {Throughout this career,
    Tal was playing all four main moves by White, although he was mainly 1.e4
    player - especially in his youth. Still, I guess he had his reasons for the
    opening choice in this game - although it is not unfair to say that back in
    1957, the significance of the opening stage at the top level was much less
    significant compared to today.} Nf6 2. Nc3 g6 3. e4 d6 4. d4 Bg7 {The King's
    Indian was brought to the forefront at the end of 1940s and beginning of 1950s
    (particularly through the effors of Boleslavsky and Bronstein, among others)
    so it is not a surprising opening choice for Tolush - especially when we
    consider the traits of his style!} 5. f3 {The Saemisch variations is one of
    the sharpest and arguably most critical ways of meeting the King's Indian
    defence. The idea is to keep the center fluid, castle queenside and go for the
    sharp g4-h4 attack. It has remained quite popular to this day. and was tested
    extensively in one of the Karpov-Kasparov matches, although nowadays the
    neural networks are suggesting some other ways as more critical.} e5 {This
    typical central counterstrike, characteristic of the King's Indian defence, is
    not the most popular move by today's standards as it reveals Black's
    intentions prematurely, but we shouldn't judge the state of the opening theory
    from 1957 too harshly. It has to be said that this move was played by some
    strong players like Ivanchuk and Sindarov, so it has every right to exist.} 6.
    Nge2 {A standard move in the Saemisch, defending the d4 point and intending
    the Be3/Bg5-Qd2-O-O-O developing scheme. Once again - other moves are possible,
    but I wouldn't want to delve too deeply in the opening stage of this game.}
    Nbd7 {Also a bit strange as the knight is passive here and it blocks the
    light-squared bishop, although some strong players have played this even in
    2020s.} 7. Bg5 {[%cal Gh7h6,Gd1d2] Developing the bishop on a more active
    square than e3 as the d4 pawn is not under the attack here. White is trying to
    provoke h6.} (7. Be3 {[%cal Gd1d2] Is an equally valid alternative. White's
    plan remains the same.}) 7... c6 {[%cal Gc6d5,Gd8a5] Taking the d5 square
    under control and opening the queen's diagonal. Very standard procedure.} (7...
    h6 8. Be3 {[%cal Re3h6] And now the h6 pawn can become an object of the attack.
    }) 8. Qd2 O-O 9. d5 {[%csl Gc4,Gd5,Ge4] A very typical idea, closing the
    center before starting the kingside attack. White is not yet hurrying with
    castling and intends to keep the king in the center for a bit, as it turns out
    it is more difficult for Black to create counterplay with the king in the
    center compared to the king on the queenside.} c5 {[%csl Gc4,Rc5,Gd5,Rd6,Ge4,
    Re5] This closing of the center was relatively a standard proceudre in the
    past, but it is just bad for Black as now White has a free hand on the
    kingside.} (9... Nc5 {It was much better to keep the tension between the pawns
    and, say, move the knight and keep the d6 pawn defended.}) (9... h6 {The
    modern engine also suggests this move, which is based on a nice tactical shot}
    10. Bxh6 (10. Be3 {Should instead be played when Black can go} cxd5 11. cxd5 h5
    {And now the fluidity of the kingside attack is prevented so Black has a much
    better position than in the game, although White still remains better due to
    the massive space advantage.}) 10... Nxe4 11. Nxe4 Qh4+) 10. g4 {[%csl Ge4,Gf3,
    Gg4][%cal Ge2g3,Gh2h4,Gh4h5] The beginning of the standard procedure in the
    Saemisch. White wants to follow things up with moves such as Ng3-h4-h5 and so
    on.} (10. h4 {Is also possible as now the blockading} h5 {Doesn't work due to}
    11. g4 hxg4 12. fxg4 {[%cal Rf6g4,Rg5d8,Gh4h5,Gf1h3] When the g4 pawn is
    immune due to the pin and Black is in mortal danger.}) 10... a6 {Trying to
    create counterplay on the queenside somehow, but Black is much, much slower.}
    11. Ng3 {The standard attacking scheme in Saemisch. The knight goes to g3 and
    h4-h5 is next on the agenda, while the knight can also contemplate jumping on
    f5 in the future - as happens in this game.} Re8 {This is just pointless,
    though.} (11... b5 {For better or for worse, Black should have started
    counterplay on the queenside.}) 12. h4 {White's play is very easy and
    straightforward while Black is struggling to create counterplay.} Qa5 {Black
    tries to play for the b5 push now, but it is all very slow and shouldn't work.}
    13. Bh6 {This logical move - exchanging the bishop that defends the king,
    seems to be a bit premature as White is not yet fully developed and is
    ignoring the play on the queenside. Although this is purely from the engine
    perspective - it doesn't yet relinquish White's advantage - it just reduces it
    somewhat.} (13. a4 {Is a move that computer really likes, simply nipping the
    b5 idea in the bud.}) 13... Nf8 ({The reason why engine doesn't like the
    previous move is this preliminary exchange:} 13... Bxh6 14. Qxh6 Kh8 {[%cal
    Gf6g8,Gd7f8] And now the king has prepared the move Ng8 if required, say after}
    15. h5 Ng8 16. Qd2 Rb8 {And even though White has the advantage, it is not yet
    clear how the attack is going to continue and Black has more counterplay than
    in the game! Of course, this is purely computer defence which is incredibly
    difficult to see even in 2022, let alone in 1957.}) 14. h5 {Now we again have
    a one-way street as Black has no counterplay.} Qc7 {[%cal Gc5c4,Gb7b5]
    Intending to play b5 and then c4 before recapturing on b5.} 15. Bd3 {Correctly
    judging that White shouldn't really fear the b5 advance.} (15. a4 {Was also
    possible, preventing the counterplay in the bud. However, since White is
    intending to castle queenside, it is probably not necessary to weaken the
    queenside further and provide Black with a hook on a4 they can use to play b5
    in the future.}) 15... b5 {Finally, but this now comes a bit late in the day.}
    16. O-O-O {Ignoring the demonstration on the kingside seems like the best
    approach. There are some other possibilities like sacking the knight on f5 at
    once, but this move seems very human and logical.} (16. cxb5 {would give Black
    some play after} c4 17. Be2 ({or} 17. Bc2 axb5 18. Bxg7 Kxg7 19. Nxb5 Qb6 20.
    a4 Kh8) 17... Bxh6 18. Qxh6 axb5 19. Nxb5 Qb6 {[%cal Rb6b2]} 20. a4 Bd7 {
    Although even here White retains the superiority with the thematic tactical
    shot} 21. Nf5 {Threatening mate on g7 and forcing} Bxf5 22. gxf5 {when White
    is firmly in the driver's seat. This Nf5 idea is very thematic in this
    position so it is definitely something worth noting.}) 16... bxc4 {Black opens
    the b-file, at least - but it turns out there is little they can do along it
    as White has many pieces defending the king and the bishop on g7 is not
    participating in the attack.} 17. Bb1 (17. Bc2 {Seems more precise, but I
    guess Tal wanted to keep the 2nd rank clear in case some lateral defence of
    the b2 pawn is required.}) (17. Bxg7 {Btw, it also seems it was better to
    include the preliminary exchange on g7 in order to avoid having the queen
    dragged to h6 and avoid that whole Kh8 business.} Kxg7 18. Bb1 {and now if
    Black tries} Kh8 19. g5 {is very strong, as the queen is not getting trapped
    on h6.}) 17... Bh8 {This is just bad, although very understandable. Tolush
    tries to keep the bishop that covers the dark-squares, but it loses some more
    time.} (17... Bxh6 18. Qxh6 Kh8 {was once again most resilient. The point is
    that now} 19. g5 (19. Qd2 {is what White should play instead, when g5 is
    coming and White is nevertheless in the driver's seat, but Black has gained a
    few tempi compared to the game.}) 19... Ng8 {Traps the queen.}) 18. Rdg1 {
    [%cal Rg1g8,Gg3f5] Now all pieces are participating in the attack and
    sacrifice on f5 is in the air.} Rb8 {[%cal Gd2b2] This is why Tal put the
    bishop on b1 - the b2 pawn is protected by the queen.} 19. Nf5 {Here we go.
    This thematic pseudosacrifice is very tough for Black as the knight is
    untouchable on this square.} (19. g5 {The prosaic advance of the g-pawn was
    also very strong as after} N6d7 20. Nf5 {Comes under arguably even stronger
    circumstances. At first glance it is hard to understand why given that now
    after} gxf5 {The g-file is closed. But it transpires that the sinple recapture
    on f5 is good enough - but also that there is} 21. g6 hxg6 22. hxg6 fxg6 23.
    exf5 {With total destruction of Black's kingside. Black can't survive this
    position.}) 19... N6d7 {It is hard to suggest a move for Black, but this
    undeveloping of the knight is surely not the most resillient attempt.} (19...
    gxf5 {The knight, of course, can't be taken due to} 20. gxf5+) (19... Rb7 {
    or some other similar waiting move, might be a bit more resistant, although
    Black's position is very much lost all the same.}) 20. Bg5 {[%cal Rf5h6,Rh6f7]
    Preparing some Nh6-Nxf7 ideas.} (20. hxg6 {The prosaic opening of the h-file
    was also sufficient - and arguably even simpler, as after} fxg6 21. Bxf8 Nxf8
    22. Nh6+ Kg7 23. f4 {Black is helpless against the opening of the kingside, e.
    g.} exf4 24. Qxf4 Qe7 25. Rf1 Rb7 26. g5 {And Qf6 and Qf7 threats are
    impossible to deal with.}) 20... Bg7 {Black tries to deal with the threat of
    Nh6 but ends up giving the bishop away.} (20... Qb6 {Black could have also
    ignored the threat, but after} 21. hxg6 fxg6 22. Nh6+ Kg7 23. f4 {Comes with a
    great effect once again - just like in the previous variation} exf4 {And here
    there are several wins, the most brutal of them being} 24. Qxf4 Qxb2+ 25. Kd1)
    21. Nxg7 Kxg7 22. Bh6+ Kg8 {Now Black's dark squares are very much weakened,
    although the position is much more resillient than it looks like at the first
    glance.} 23. f4 {Now with the knight gone from h6, this move seems to be not
    as powerful as in the previous variations, although White still keeps a big
    chunk of the advantage.} (23. Rh2 {Some patient move like Rh2, overprotecting
    b2 and maybe intending to double on the h-file, was probably better. White has
    all the time in the world to improve the pieces.}) (23. Bc2 {[%cal Gc2a4] With
    the idea of playing Ba4 and exchanging the passive bishop for one of the
    defenders of the king, was also an interesting idea worth examining.}) 23...
    exf4 24. Qxf4 Qd8 {[%cal Gd8f6] Now Black is kinda covering some dark-squares
    and his position does have some degree of the resillience, although White is
    objectively completely winning.} 25. hxg6 {Opening the h-file seems very
    sensible.} (25. Qxd6 {Is exactly what Black was hoping for, as then there are
    some crazy defensive ideas such as} g5 {[%cal Gb8b6] With the idea of Rb6.} (
    25... Rb6 26. Qf4 (26. Qg3 g5 27. Bxf8 Kxf8 {And Black is actually the one to
    be preferred due to the control of the dark-squares, all of a sudden.}) 26...
    Ne5 {Is also not as clear cut as Black now has some nice dark-squares to work
    with.})) (25. Bg5 f6 26. hxg6 {Was also possible, weakening the king even
    further and profiting from the fact that the bishop on g5 is immune due to}
    fxg5 27. Qf7+) 25... Nxg6 (25... fxg6 26. Qxd6 {Is now much stronger for White
    as the h- and f-files are opened, so after} Rb6 27. Qg3 g5 (27... Ne5 28. Bf4
    Qc7 29. g5 {Is also very strong for White. Yes, the knight on e5 is great, but
    we have the open h-file and a strong dark-squared bishop of our own.}) 28. Bxf8
    Kxf8 {Now doesn't work due to numerous reasons - but mostly because of the
    open f-file} 29. Rf1+ Kg8 30. e5 {[%cal Rb1h7,Rh1h7] And now the weakness of
    the h7 is terminal. This is the difference compared to the previous line.}) 26.
    Qh2 {[%cal Rh1h8] Lining up on the h-file. Despite all the inaccuracies, the
    position is still winning for White - which goes on to show how bad Black's
    position was to begin with.} (26. Qxd6 Nge5 {Is once again very unclear and
    better to be avoided.}) 26... Nde5 {It is logical to bring the knight to e5
    and open up the bishop, although there are other options as well.} 27. Bf4 {
    But this is a very strange decision, giving up the dark-squared bishop.} (27.
    Bd2 {Seemed like the best move - discovering an attack on h7 and not giving up
    the strong bishop.}) 27... Nf8 (27... Nxf4 {It was possible to take the bishop
    on f4 and then after} 28. Qxf4 Qe7 {Hope to establish some sort of a defense
    on the dark-squares with Ng6 and Qe5 next. It does look scary for a human, but
    the engine insists it is not at all so easy for White to demonstrate a way
    toward a clear advantage.}) (27... Qf6 {Was also more resillient, intending to
    return the pawn on h7 as after} 28. Qxh7+ Kf8 {Black has a very nice control
    over the dark-squares, the bishop is under the attack, g4 pawn is hanging and
    the king will escape to e7 where it will be very safe. White does have some
    advantage, but it is much less clear compared to what happened in the game.})
    28. Qh6 {[%cal Gf4g5] Now White will get in Bg5 and maintain the pressure on
    the dark-squares.} Neg6 {A final mistake in an objectively difficult position.}
    (28... Rb7 {Or something along those lines - not moving the knight from e5 and
    trying to add some more protection along the 7th rank, was more resillient,
    although White is still very much winning.}) 29. Bg5 f6 30. e5 {[%cal Rb1h7,
    Gc3e4] A brilliant breakthrough at the most fortified point. White throws in a
    pawn, but opens up the bishop on b1 as well as the square on e4 for the knight.
    } Rxe5 (30... fxg5 31. Bxg6 Nxg6 32. Qxh7+ {Leads to a very quick mate.}) 31.
    Bxg6 Rb7 {[%cal Gb7h7] Trying to add some protection along the 7th rank, but
    now this comes in too late.} (31... Nxg6 32. Qxh7+ Kf8 33. Qxg6 {Once again
    leads to a mate very very soon.}) 32. Ne4 {[%cal Re4f6] Bringing the last
    piece that is not participating in the attack into the game ("Bring all the
    boys to the party") and not really caring about the fact that the bishop on g5
    is hanging.} fxg5 (32... Rxg5 {Is also losing after the prosaic} 33. Bf5 {
    [%cal Re4f6,Rh6f6] When the pawn on f6 can't be defended.} Rf7 34. Bxc8 Qxc8
    35. Nxf6+ $18) 33. Rf1 {[%cal Ge4f6,Gf1f8] A brilliant quiet move, threatening
    the capture on f8 and check on f6, among other things.} Rxe4 (33... Nxg6 34.
    Nf6+ {Wins on the spot for White e.g.} Kh8 35. Qxh7+ Rxh7 36. Rxh7#) 34. Bxe4 {
    Now it is all over as White is up an exchange and still has a raging attack
    going on.} Rg7 35. Rf6 Bxg4 36. Rhf1 {A prosaic and "boring" way of ending up
    the game - but more than good enough.} (36. Bxh7+ {Was leading to a quick mate
    after} Nxh7 (36... Rxh7 37. Rxf8+ Qxf8 38. Qxh7#) 37. Rg6 Rxg6 38. Qxg6+) 36...
    Nd7 37. Rxd6 Qe7 38. Rxa6 {[%cal Ga6a8] Simply collecting all the pawns and
    threatening Ra8.} Kh8 39. Bxh7 {[%cal Ga6a8] A flashy finish, exploiting the
    weakness of the back rank.} Nb8 (39... Rxh7 40. Ra8+ {Leads to a quick mate.})
    40. Bf5+ Kg8 41. Be6+ Bxe6 42. Rxe6 {And here Tolush finally decided to throw
    in the towel. Perhaps not the most beautiful game by Mikhail Tal, but the one
    I felt is a good introduction to his style and to some of the later
    brilliancies we will see in this article. --- Furthermore, I find these older
    games very instructive mainly because quite often, one side (in this case
    Tolush) completely misplays the opening and gets in a lost position early on -
    which is something that happens very often at the club level. Seeing a player
    of Tal caliber handling such a position - and also misplaying it at certain
    moments - can be regarded as more instructive and relatable than, say, recent
    encounters at the very top level.} 1-0`,

    `[Event "USSR Championship"]
    [Site "Leningrad URS"]
    [Date "1960.02.20"]
    [Round "16"]
    [White "Boris Spassky"]
    [Black "David Bronstein"]
    [Result "1-0"]
    [ECO "C36"]
    [PlyCount "45"]
    [EventDate "1960.??.??"]
    1. e4 e5 2. f4 exf4 3. Nf3 d5 4. exd5 Bd6 5. Nc3 Ne7 6. d4 O-O 7. Bd3 Nd7 8.
    O-O h6 9. Ne4 Nxd5 10. c4 Ne3 11. Bxe3 fxe3 12. c5 Be7 13. Bc2 Re8 14. Qd3 e2
    15. Nd6 {One of the deepest sacrifices this side of The Evergreen Game --
    Soltis} Nf8 16. Nxf7 exf1=Q+ 17. Rxf1 Bf5 18. Qxf5 Qd7 19. Qf4 Bf6 20. N3e5 Qe7
    21. Bb3 Bxe5 22. Nxe5+ Kh7 23. Qe4+ 1-0`,

    `[Event "San Sebastian"]
    [Site "San Sebastian"]
    [Date "1911.??.??"]
    [Round "?"]
    [White "Capablanca, Jose"]
    [Black "Burn, Amos"]
    [Result "1-0"]

    1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.d3 { This is a very solid development,
    to which I was much addicted at the time, because of my ignorance of the multiple
    variations of the openings. } 5...d6 6.c3 Be7 ( { In this variation there is the
    alternative of developing this Bishop via g7, after } 6...g6 ) 7.Nbd2 O-O
    8.Nf1 b5 9.Bc2 d5 10.Qe2 dxe4 11.dxe4 Bc5 { Evidently to make room for the Queen
    at e7, but I do not think the move advisable at this stage. } ( 11...Be6 {
    is a more natural and effective move. It develops a piece and threatens Bc4
    which would have to be stopped. } ) 12.Bg5 Be6 { Now it is not so effective,
    because White's Queen's Bishop is out, and the Knight, in going to e3 } 13.Ne3
    { defends c4 and does not block the Queen's Bishop. } 13...Re8 14.O-O Qe7 {
    This is bad. Black's game was already not good. He probably had no choice but to
    take the Knight with the Bishop before making this move. } 15.Nd5 Bxd5 16.exd5 Nb8
    { In order to bring it to d7, to support the other Knight and also his King's Pawn.
    White, however, does not allow time for this, and by taking advantage of his superior
    position is able to win a Pawn. } 17.a4 b4 ( { Since he had no way to prevent the loss
    of a Pawn, he should have given it up where it is, and played } 17...Nbd7 { in order
    to make his position more solid. The text move not only loses a Pawn, but leaves Black's
    game very much weakened. } ) 18.cxb4 Bxb4 19.Bxf6 Qxf6 20.Qe4 Bd6 21.Qxh7+ Kf8 { With a
    Pawn more and all his pieces ready for action, while Black is still backward in
    development, it only remains for White to drive home his advantage before Black
    can come out with his pieces, in which case, by using the open h-file, Black might 
    be able to start a strong attack against White's King. White is able by his next move to
    eliminate all danger. } 22.Nh4 Qh6 { This is practically forced. } ( { Black could not
    play } 22...g6 { because of } 23.Bxg6 { White meanwhile threatened } ) 23.Qxh6 gxh6 24.Nf5
    h5 25.Bd1 Nd7 26.Bxh5 Nf6 27.Be2 Nxd5 28.Rfd1 Nf4 29.Bc4 Red8 30.h4 a5 { Black must lose
    time assuring the safety of this Pawn. } 31.g3 Ne6 32.Bxe6 fxe6 33.Ne3 Rdb8 34.Nc4 Ke7
    { Black fights a hopeless battle. He is two Pawns down for all practical purposes, and
    the Pawns he has are isolated and have to be defended by pieces. } 35.Rac1 Ra7 { White
    threatened } 36.Re1 Kf6 37.Re4 Rb4 38.g4 Ra6 ( { If } 38...Rxa4 { then } 39.Nxd6 { would of
    course win a piece. } ) 39.Rc3 Bc5 40.Rf3+ Kg7 41.b3 Bd4 42.Kg2 Ra8 43.g5 Ra6 44.h5 Rxc4
    45.bxc4 Rc6 46.g6 { Black resigns. } 1-0`,

    `[Event "?"]
    [Site "?"]
    [Date "2017.04.01"]
    [Round "?"]
    [White "Prof. Mcgonagall"]
    [Black "Ronald Wesley & Co."]
    [Result "0-1"]
    [SetUp "1"]
    [FEN "5r1k/1pN1R1pp/1Pb5/n1r1P1n1/7N/b2Q4/7P/1R4K1 b - - 0 1"]
    [PlyCount "7"]

    { This is the position Silman invented. In the given position,
    Harry is the bishop on a3, Hermione rook on f8 and Ron the knight on g5. } 1...
    Rc3 { A fully correct sacrifice that frees the c5 square for Harry the bishop. }
    2. Qxc3 { There is nothing better. Now comes the famous knight sacrifice that...
    turns out to be only the second best move in the position } Nh3+ { Ron sacrifices
    itself in order to allow Harry to mate and deserve all the glory. Nothing new
    under the sun. } (2... Bc5+ { Would actually mate one move faster, but if this
    move was made, Voldemort would probably never die. Because Harry, playing without
    the knight, wouldn't have survived the onslaught of the White queen, like Ron
    did. } 3. Qxc5 Nh3# { Is checkmate }) 3. Qxh3 Bc5+ 4. Qe3 Bxe3# 0-1`,
  ];
}
