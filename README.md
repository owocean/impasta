# impasta (unfinished)
Among Us cheat utility  
Instead of reading memory like the other cheats, this app watches for UDP packets sent and received from the among us servers.  

## NOTICE
**PLEASE DO NOT USE THIS TO CHEAT IN REAL GAMES!**  
This project was made for educational purposes. Cheating isn't rewarding and ruins the game for others.

## prerequisites
*  [WinPcap for windows 10 (assuming you're on windows)](https://nmap.org/npcap/)
* among us obviously

## install
```sh
git clone https://github.com/owocean/impasta.git
cd impasta
npm i
```

## usage
```sh
node index
```
Press `v` to toggle verbose output

## features
- [x] Log chat messages
- [x] Log player joins
- [x] Identify Impostors
- [ ] Identify players by Name/color
- [ ] Log events (Task complete, Murder, etc.)
- [ ] Force meetings/murders/etc.
- [ ] Emit webhook/websocket on event