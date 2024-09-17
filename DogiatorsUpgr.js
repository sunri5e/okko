function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const desireUpgrade = [
  {
    cardId: 1,
    title: "Combat Training",
    level: 13,
  },
  {
    cardId: 2,
    title: "Study of Combat Techniques",
    level: 13,
  },
  {
    cardId: 3,
    title: "Proper Nutrition",
    level: 13,
  },
  {
    cardId: 4,
    title: "Training Camp",
    level: 12,
  },
  {
    cardId: 5,
    title: "Finding Motivation",
    level: 12,
  },
  {
    cardId: 6,
    title: "Reflexology",
    level: 13,
  },
  {
    cardId: 7,
    title: "Combat Spirit",
    level: 13,
  },
  {
    cardId: 8,
    title: "Vitamin Supplements",
    level: 13,
  },
  {
    cardId: 9,
    title: "Secret Training",
    level: 13,
  },
  {
    cardId: 10,
    title: "Protein Diet",
    level: 12,
  },
  {
    cardId: 11,
    title: "Mentorship",
    level: 12,
  },
  {
    cardId: 12,
    title: "Video Analysis",
    level: 12,
  },
  {
    cardId: 13,
    title: "Bribing the Judge",
    level: 12,
  },
  {
    cardId: 14,
    title: "Combat Simulations",
    level: 11,
  },
  {
    cardId: 15,
    title: "Energy Drinks",
    level: 0,
  },
  {
    cardId: 16,
    title: "Personal Trainer",
    level: 12,
  },
  {
    cardId: 17,
    title: "Masseur",
    level: 12,
  },
  {
    cardId: 18,
    title: "Dietitian",
    level: 12,
  },
  {
    cardId: 19,
    title: "Personal Doctor",
    level: 12,
  },
  {
    cardId: 20,
    title: "Experienced Mentors",
    level: 12,
  },
  {
    cardId: 21,
    title: "Advertising Contract",
    level: 0,
  },
  {
    cardId: 22,
    title: "Sponsorship Support",
    level: 0,
  },
];

const tg_data =
  "tg_data=query_id.....";

async function makeSettings() {
  const upgradeSettings = [];

  await fetch("https://tte.dogiators.com/api/v1/upgrade/list?" + tg_data, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const upgrades = data.result.profile_upgrades;

      for (const desire of desireUpgrade) {
        const upgrade = upgrades.find(
          (obj) => obj.upgrade_id === desire.cardId
        );

        if (upgrade !== undefined) {
          if (upgrade.level < desire.level) {
            upgradeSettings.push({
              cardId: desire.cardId,
              times: desire.level - upgrade.level,
            });
          } else {
            console.log(`${desire.title} already level ${desire.level}`);
            upgradeSettings.push({
              cardId: desire.cardId,
              times: 0,
            });
          }
        } else {
          upgradeSettings.push({
            cardId: desire.cardId,
            times: desire.level,
          });
        }
      }
    })
    .catch((error) => console.error(error));

  console.log(upgradeSettings);

  return upgradeSettings;
}

async function upgrade(cardId, isAllowed) {
  let allowNext = isAllowed;

  if (!allowNext) {
    console.log("Upgrade not allowed");
    return allowNext;
  }

  await fetch("https://tte.dogiators.com/api/v1/upgrade/buy?" + tg_data, {
    method: "POST",
    body: JSON.stringify({ upgrade_id: cardId }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const upgrade_name = data.result.upgrade.title;
      const upgrade_level = data.result.profile_upgrade.level;
      const modifiers = data.result.upgrade.modifiers;
      const nextLevelPrice = modifiers[upgrade_level].price;
      const userBalance = data.result.profile.balance;

      console.log(
        `Upgrade: ${upgrade_name}, Level: ${upgrade_level}, Next level price: ${nextLevelPrice}, User balance: ${userBalance}`
      );
      console.log(data);

      if (userBalance < nextLevelPrice || upgrade_level == modifiers.length) {
        allowNext = false;
      }
    })
    .catch((error) => {
      console.error(error)
      allowNext = false;
    });

  console.log("Allow next:", allowNext);

  return allowNext;
}

async function main(cardId, times) {
  let allowed = true;

  while (times--) {
    if (!allowed) {
      break;
    }

    await upgrade(cardId, allowed).then((data) => {
      allowed = data;
      console.log("data", data);
    });
    await sleep(randomInt(1000, 5000));
  }

  return allowed;
}

async function start(settings) {
  let allowed = true;

  for (const setting of settings) {
    await main(setting.cardId, setting.times).then((data) => {
      allowed = data;
    });

    if (!allowed) {
      break;
    }
  }
}

const settings = await makeSettings();

start(settings);
