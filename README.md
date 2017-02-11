Welcome!

## Polytron

What is Polytron and why has been created.

### Architecture



## First attempt at reverse engineering RE Director's cut for PSONE

Downloaded RE Director's cut ROM
Converted .bin and .cue files into a mountable .iso file
Inside the ROM i found a TMD file (model file) on PSXUSA/PLAYERS/WS202.TMD


# convert ecm file to iso
unecm wipeout.bin.ecm wipeout.bin

# cue file
FILE "wipeout.bin" BINARY
  TRACK 01 MODE2/2352
    INDEX 01 00:00:00

## generate iso starting from bin/cue
bchunk wipeout.bin wipeout.cue wipeout.iso

## check game ISO for .TMD files
ls -R | grep .TMD
