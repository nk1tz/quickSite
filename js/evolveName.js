var target = "Nathaniel Kitzke";
var lowestScore = Infinity;
var topPerformerGenome = [];
var mutationRate = 0.009;
var sexNumber = 4;
var sBias = 0.8;
var popSize = 30;
var elites = 1;

// Define character space
const CHAR_SPACE_MIN = 32;
const CHAR_SPACE_MAX = 126;

// Define nodes
var nameNode1 = document.getElementById('nameNode1');
// var nameNode2 = document.getElementById('nameNode2');


beginEvolution(target)

function beginEvolution(target) {
  let targetGenome = getGenomeFromString(target)
  let initialPop = generateRandomPopulationOfSize(targetGenome.length, popSize);
  let initialScores = getScoresForEntirePopulation(initialPop, targetGenome)
  evolution(targetGenome, initialPop, initialScores);
}


function evolution(targetGenome, pop, scores) {
  let [sortedPop, sortedScores] = getSortedPopAndScores(scores, pop);
  pop = generateNewPopulation(sortedPop, sortedScores);
  scores = getScoresForEntirePopulation(pop, targetGenome);
  if(sortedScores[0] > 0) {
    setTimeout(()=>evolution(targetGenome, pop, scores), 0)
    displayData(sortedPop, sortedScores);
  }
  else {
    displayData(sortedPop, sortedScores);
    return;
  }
}


function displayData(sortedPop, sortedScores) {
  nameNode1.textContent = getStringFromGenome(sortedPop[0]);
  // nameNode2.textContent = getStringFromGenome(sortedPop[0]);
}


function generateNewPopulation(sortedPop, sortedScores) {
  let newGeneration = [];
  let p = 0;
  while(p < popSize) {
    if(p < elites) {
      newGeneration.push(sortedPop[p])
    }
    else {
      newGeneration.push(
        mateGenomesGetNewGenome(
          ...selectNindividuals(sortedPop, sortedScores)
        )
      )
    }
    p++;
  }
  return newGeneration;
}


function getSortedPopAndScores(scoresArray, popArray) {
  //1) combine the arrays:
  var list = [];
  for (var j in scoresArray)
      list.push({'genome': popArray[j], 'score': scoresArray[j]});
  //2) sort:
  list.sort(function(a, b) {
      return ((a.score < b.score) ? -1 : ((a.score == b.score) ? 0 : 1));
  });
  //3) separate them back out:
  for (var k = 0; k < list.length; k++) {
      popArray[k] = list[k].genome;
      scoresArray[k] = list[k].score;
  }
  return [popArray, scoresArray];
}


function selectNindividuals(popArray, scoresArray) {
  let weightsArray = getWeights(scoresArray);
  let selectedIndividuals = [];
  let s = 0;
  while (s < sexNumber) {
    selectedIndividuals.push(popArray[weightedRandSelection(weightsArray)]);
    s++;
  }
  return selectedIndividuals;
}


function weightedRandSelection(weights) {
  var sumOfWeights = weights.reduce((a,b)=>a+b);
  var i, sum = 0, r = Math.random()*sumOfWeights;
  for (i in weights) {
    sum += weights[i];
    if (r <= sum) return i;
  }
}


function getWeights(scores) {
  return scores.map(s => 1/(s^sBias));
}


function mutateGenome(genome) {
  return genome.map(n => {
    if(getRandomInt(0, 100) <= mutationRate*100) {
      let coin = Math.random();
      if(coin < 0.3) {
        return n + 1;
      }
      else if(coin >= 0.3 && coin < 0.6) {
        return n - 1;
      }
      else if(coin >= 0.6 && coin < 0.75) {
        return n + 2;
      }
      else if(coin >= 0.75 && coin < 0.9) {
        return n - 2;
      }
      else {
        return getRandomInt(CHAR_SPACE_MIN, CHAR_SPACE_MAX);
      }
    }
    return n
  })
}


function mateGenomesGetNewGenome(...args) {
  let n = args.length;
  let chunk = Math.floor(args[0].length / n);
  let m = 0;
  let newGenome = [];
  while (m < n){
    if(m === n-1){
      newGenome = newGenome.concat(args[m].slice(m*chunk, args[0].length));
    }
    else {
      newGenome = newGenome.concat(args[m].slice(m*chunk, (m+1)*chunk));
    }
    m++;
  }
  return mutateGenome(newGenome);
}


function getScoresForEntirePopulation(population, targetGenome) {
  let newScores = [];
  let j = 0;
  while (j < population.length) {
    newScores.push(compare2Genomes(population[j], targetGenome));
    j++;
  }
  return newScores;
}


function generateRandomPopulationOfSize(individualLength) {
  let randPopulation = [];
  let n = 0;
  let randGenome;
  while (n < popSize) {
    randPopulation.push(generateRandomGenomeOfLength(individualLength));
    n++;
  }
  return randPopulation;
}


function generateRandomGenomeOfLength(length) {
  let newGenome = [];
  let i = 0;
  while (i < length) {
    newGenome.push(getRandomInt(CHAR_SPACE_MIN, CHAR_SPACE_MAX));
    i++;
  }
  return newGenome;
}


function getGenomeFromString(str) {
  return str.split("").map(char => char.charCodeAt(0))
}


function getStringFromGenome(genome) {
  return String.fromCharCode(...genome);
}


function compare2Genomes(g1, g2) {
  return g1.reduce((acc, curr, i) => acc + Math.abs(curr - g2[i]), 0);
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
