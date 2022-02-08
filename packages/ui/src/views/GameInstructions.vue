<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="INSTRUCTIONS" />
      <h2 class="title">Howdy! Let’s raise some bufficorns together!</h2>
      <p class="text">
        Connect with other ETHDenver attendees to become the best Bufficorn
        breeder in the world and to earn your place in WittyBufficorn NFT Hall
        of Fame!
      </p>
      <p class="text">
        WittyBufficorns is a physical + virtual hybrid experience that gamifies
        networking in the context of the ETHDenver events, brought to you by
        your witty friends at Witnet - the Multichain Decentralized Oracle - in
        cooperation with the ETHDenver organization.
      </p>
      <div class="disclaimer">
        <h2 class="title">DISCLAIMER</h2>
        <p class="text">
          NO BUFFICORNS WERE HARMED IN THE PRODUCTION OF THIS GAME. WE BELIEVE
          BUFFICORNS AND ALL OTHER ANIMALS (BOTH REAL AND FANTASY CREATURES)
          MUST BE LOVED AND RESPECTED.
        </p>
      </div>
      <h2 class="title">Join a ranch</h2>
      <p class="text">
        Upon checking in for ETHDenver at The Art Hotel (1201 Broadway), you
        will be given a badge that identifies you as a member of one of the 6
        ranches in the game, each named after a presenting sponsor:
      </p>
      <div class="ranch-logos">
        <img
          v-for="ranch in ranches"
          :key="ranch"
          class="ranch"
          :src="importSvg(ranch)"
          alt="Bufficorn"
        />
      </div>
      <p class="text">
        To join your ranch and start playing the game, simply use the
        WittyBufficorns web app on your phone (<a
          class="link"
          href="https://bufficorns.com"
          target="_blank"
          >https://bufficorns.com</a
        >) to scan the unique QR code printed on the back side of your badge.
        The first to scan a badge owns it!
      </p>
      <p class="text">
        If you did not get one of these badges, please drop by the “Witnet - The
        Multichain Decentralized Oracle” booth next to the registration area in
        the Art Hotel and get one before they run out!
      </p>
      <h2 class="title">Your Bufficorns</h2>
      <p class="text">
        Each ranch takes care of 4 bufficorns. These magical creatures need a
        lot of different resources to grow and improve their different traits:
      </p>
      <table class="table table-auto">
        <thead>
          <tr>
            <th></th>
            <th class="table-title">Trait</th>
            <th class="table-title">Resource</th>
            <th class="table-title">Provider ranch</th>
          </tr>
        </thead>
        <tbody>
          <tr class="row" :style="{ color: ATTRIBUTES.coat.color }">
            <td>
              <img class="icon" :src="importSvg('coat')" alt="icon" />
            </td>
            <td class="col trait">Coat</td>
            <td class="col">Warm Hay</td>
            <td class="col">The Ol’ Algoranch</td>
          </tr>
          <tr class="row" :style="{ color: ATTRIBUTES.coolness.color }">
            <td>
              <img class="icon" :src="importSvg('coolness')" alt="icon" />
            </td>
            <td class="col trait">Coolness</td>
            <td class="col">Fresh Grass</td>
            <td class="col">Infinity Harmony Farm</td>
          </tr>
          <tr class="row" :style="{ color: ATTRIBUTES.intelligence.color }">
            <td>
              <img class="icon" :src="importSvg('intelligence')" alt="icon" />
            </td>
            <td class="col trait">Intelligence</td>
            <td class="col">Smart Sedge</td>
            <td class="col">Balancer Peak Estate</td>
          </tr>
          <tr class="row" :style="{ color: ATTRIBUTES.speed.color }">
            <td>
              <img class="icon" :src="importSvg('speed')" alt="icon" />
            </td>
            <td class="col trait">Speed</td>
            <td class="col">Mighty Acorn</td>
            <td class="col">Gold Reef Company</td>
          </tr>
          <tr class="row" :style="{ color: ATTRIBUTES.stamina.color }">
            <td>
              <img class="icon" :src="importSvg('stamina')" alt="icon" />
            </td>
            <td class="col trait">Stamina</td>
            <td class="col">Tireless Water</td>
            <td class="col">Vega Slopes Range</td>
          </tr>
          <tr class="row" :style="{ color: ATTRIBUTES.vigor.color }">
            <td>
              <img class="icon" :src="importSvg('vigor')" alt="icon" />
            </td>
            <td class="col trait">Vigor</td>
            <td class="col">Hearty Berry</td>
            <td class="col">Opolis Reservation</td>
          </tr>
        </tbody>
      </table>
      <p class="text">
        When you trade with other players, the resources that you get from them
        are automatically assigned to one of the bufficorns of your ranch. To
        select which bufficorn will be receiving the resources, simply check the
        ⭐ icon next to that bufficorn’s profile in the WittyBufficorns web app.
      </p>
      <p class="text">
        You will need to do your best to keep the score high for all the traits
        of the 4 bufficorns in your ranch, as the most balanced they are, the
        better (see “Leaderboard” section).
      </p>
      <h2 class="title">Trading resources</h2>
      <p class="text">
        Resources are acquired by trading with other breeders, i.e. scanning the
        QR codes in their ranch badges.
      </p>
      <p class="text">
        To scan somebody’s QR, simply tap the “TRADE” button in the
        WittyBufficorns web app, make sure that it has permission to access the
        camera of your phone, and point the camera directly to the QR code.
      </p>
      <p class="text">
        Trades are one-sided: when you scan somebody’s badge, you are generating
        and giving them an amount of the resource that your ranch produces. So
        don’t forget to get the other breeder to scan your own QR code so that
        you can get their resource too!
      </p>
      <p class="text">Here are the rules for trading:</p>
      <ul class="list-container">
        <li class="text list">Sending a resource takes 2 minutes.</li>
        <li class="text list">Receiving a resource takes 2 minutes.</li>
        <li class="text list">You can send and receive at the same time.</li>
        <li class="text list">
          You can’t send a resource to the same breeder twice in 30 minutes. The
          same rule applies to receiving resources.
        </li>
        <li class="text list">
          Trading repeatedly with the same breeder will give you half the
          resources as the previous time (800 → 400 → 200 → 100 → 50).
        </li>
        <li class="text list">
          You can trade with members of your own ranch. Of course both will be
          getting the same resource.
        </li>
        <li class="text list">You can’t trade with yourself, lol.</li>
      </ul>
      <h2 class="title">Duration of the game</h2>
      <p class="text">
        The main game will run from Thursday Feb 17th right after the ETHDenver
        Main Event Opening Ceremony to Sunday Feb 20th, right before the Closing
        Ceremonies.
      </p>
      <p class="text">
        However, you should join the game and start getting familiar with it at
        any time before the 17th. In fact, the bufficorn scores achieved during
        this “testnet phase” will be translated to the main game on the 17th,
        only divided by 10. However, breeder scores will be reset on the 17th to
        be fair to all players.
      </p>
      <h2 class="title">Leaderboard</h2>
      <p class="text">
        At any moment during the game, you can check who’s winning in the
        leaderboard.
      </p>
      <p class="text">
        The leaderboard can be accessed through the menu on the top left corner
        of the WittyBufficorns webapp.
      </p>
      <p class="text">These are the rules for ranking:</p>
      <ul class="list-container">
        <li class="text list">
          The score of a bufficorn equals the score of its worst trait.
        </li>
        <li class="text list">
          The score of a ranch equals the score of its worst bufficorn.
        </li>
        <li class="text list">
          The score of a breeder is the total amount of resources that they got
          for their ranch.
        </li>
      </ul>
      <h2 class="title">Prizes</h2>
      <p class="text">
        The prizes will be distributed as NFT medals on Polygon, so that you can
        proudly (and affordably!) show them off in your OpenSea profile along
        all your treasured NFTs and POAPs.
      </p>
      <ul class="list-container">
        <li class="text list">
          Everyone will be getting a participant medal with their breeder score
          and position in the ranking.
        </li>
        <li class="text list">
          All the members of the 3 best ranches will get gold, silver or bronze
          medals for the best ranch.
        </li>
        <li class="text list">
          All the members of the ranches owning 1 or more of the 3 best
          bufficorns will get gold, silver or bronze medal for the best
          bufficorn.
        </li>
        <li class="text list">
          For each of the bufficorn traits, all the members of the ranches
          owning 1 or more of the 3 bufficorns that stands out the most in that
          trait will get gold, silver or bronze medals for the bufficorn with
          the best coat, coolness, intelligence, speed, stamina or vigor.
        </li>
        <li class="text list">
          The 3 best breeders will get gold, silver or bronze medals for the
          best breeder.
        </li>
      </ul>
      <p class="text">
        As you can see, there are plenty of medals, so chances are that you will
        be getting at least a couple of them!
      </p>
      <p class="text">
        Minting time will begin after the Closing Ceremony on Feb 20th. At that
        time, you will be able to preview of the medals that you won, and will
        be able to mint them all with a single Polygon transaction.
      </p>
      <p class="text">
        Additionally, we are preparing bonus prizes and crypto raffles for those
        who mint their prizes NFTs on Polygon. Stay tuned to
        <a class="link" href="https://twitter.com/witnet_io" target="_blank"
          >@witnet_io</a
        >
        on Twitter for further announcements!!!
      </p>
      <h2 class="title">POAP Scavenger Hunt</h2>
      <p class="text">
        Have you seen those POAP QR codes that are all over the place? Why not
        trying to scan them from within the WittyBufficorns web app? Maybe you
        get a bonus or something… 🤔
      </p>
      <h2 class="title">Tips and tricks</h2>
      <ul class="list-container">
        <li class="text list">
          To quickly find players that can provide the resource that improves a
          certain trait, simply look for those who wear a ranch badge of the
          same color as the trait. E.g. if you are lacking stamina, as stamina
          is blue, look for players with a blue badge (Vega Slopes Range).
        </li>
        <li class="text list">
          Because of the restrictions when trading repeatedly with the same
          breeders, it is always a great idea to find new breeders to trade
          with.
        </li>
        <li class="text list">
          Minting your prize NFTs at certain times will make them look slightly
          different because the minting smart contracts are using the Witnet
          multichain decentralized oracle to fetch the weather in different
          locations in Colorado in real time and adjust the artwork of the NFTs
          accordingly. Mind blowing, huh? Learn more about Witnet below.
        </li>
      </ul>
      <h2 class="title">What’s all this Witty Witnet thingy?</h2>
      <p class="text">
        Witnet is a multichain decentralized oracle that focuses on providing
        reliable data to “autonomous” smart contracts — those that require a
        high degree of tamper resistance and should not leave space for
        manipulation.
      </p>
      <p class="text">
        Put simply, Witnet can power and secure most DeFi primitives like price
        feeds, stablecoins, synthetics, etc., as well as acting as a reliable
        source of randomness for creating uniqueness in NFTs, and HTTPS adapters
        for many other innovative use cases.
      </p>
      <p class="text">
        Witnet is already available on Ethereum, Polygon, Harmony, Celo, Metis,
        Boba, Conflux and KuCoin Community Chain. Support for Avalanche,
        Arbitrum, Binance Smart Chain, Aurora, Moonbeam and Optimism are also
        around the corner.
      </p>
      <p class="text">
        Witnet always tries to support Web3 community events like EthDenver,
        EthCC, LisCon and DevCon in the best we know: by proposing social games
        that are both a great showcase of the capabilities of the Witnet oracle,
        and a once-in-a-lifetime networking and gaming experience for the
        attendees.
      </p>
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { importSvg } from '@/composables/importSvg.js'
import { onMounted } from 'vue'
import { ATTRIBUTES, RANCHES } from '@/constants'

export default {
  setup () {
    const player = useStore()
    onMounted(() => {
      player.getTheme()
    })
    const ranches = Object.values(RANCHES)
    ranches.pop()
    return { player, importSvg, ATTRIBUTES, ranches }
  }
}
</script>

<style lang="scss" scoped>
.container {
  text-align: left;
  .title {
    font-size: 24px;
  }
  .text {
    font-size: 18px;
  }
  .table-title {
    color: var(--primary-color);
  }
  .list {
    list-style-type: circle;
    &::marker {
      color: var(--primary-color);
    }
  }
  .disclaimer {
    margin: 16px;
    padding: 16px;
    background-color: var(--primary-color-opacity-1);
    border-radius: 4px;
    color: var(--primary-color);
    text-align: center;
    line-height: 1.5;
    font-weight: bold;
  }
  .ranch-logos {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 16px;
    justify-content: center;
    align-items: center;
    .ranch {
      height: 100px;
    }
  }
  .table {
    text-align: left;
    .col {
      padding-right: 16px;
      font-weight: 600;
    }
    .trait {
      padding-left: 8px;
    }
    .row {
      border-radius: 4px;
      margin-bottom: 8px;
      height: 68px;
    }
    .icon {
      width: 40px;
    }
  }
  .link {
    color: var(--primary-color);
    text-decoration: underline;
    font-weight: bold;
  }
  .list-container {
    padding-left: 24px;
  }
}
@media (max-width: 600px) {
  .container {
    .ranch-logos {
      .ranch {
        height: 50px;
      }
    }
  }
}
</style>
