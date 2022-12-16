#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"go"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`
CC_SRC_PATH="../chaincode/inventory/"
CC_SRC_PATH_TRANSPORT="../chaincode/transportDocument/"
CC_SRC_PATH_DRIVER="../chaincode/drivers/"
CC_SRC_PATH_ARIM="../chaincode/arim/"
CC_SRC_PATH_REQUESTLOAD="../chaincode/requestLoad/"
CC_SRC_PATH_QUOTES="../chaincode/quotes/"
CC_SRC_PATH_AUTHORIZATION="../chaincode/authorization/"
CC_SRC_PATH_MANDATOS="../chaincode/mandatos/"

CC_SRC_PATH_MOTONAVEADVERT="../chaincode/motonaveAdvert/"
CC_SRC_PATH_SERVICESLOAD="../chaincode/servicesLoad/"
CC_SRC_PATH_VEHICLES="../chaincode/vehicles/"
CC_SRC_PATH_CUSTOMAGENCY="../chaincode/customsagency/"

# clean out any old identites in the wallets
rm -rf middleware/wallet/*

# launch network; create channel and join peer to channel
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn document -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH}
./network.sh deployCC -ccn requestLoad -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_REQUESTLOAD}
./network.sh deployCC -ccn quotes -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_QUOTES}
./network.sh deployCC -ccn ServicesLoad-ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_SERVICESLOAD}
./network.sh deployCC -ccn vehicle -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_VEHICLES}
./network.sh deployCC -ccn motonaveAdvert -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_MOTONAVEADVERT}
./network.sh deployCC -ccn transport -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_TRANSPORT}
./network.sh deployCC -ccn driver -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_DRIVER}
./network.sh deployCC -ccn arim -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_ARIM}
./network.sh deployCC -ccn authorization -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_AUTHORIZATION}
./network.sh deployCC -ccn mandatos -ccv 1 -ccl typescript -ccp ${CC_SRC_PATH_MANDATOS}
./network.sh deployCC -ccn customsAgency -ccv 1 -ccl typescript -ccp ${CC_SRC_CUSTOMAGENCY}

popd

cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

EOF

