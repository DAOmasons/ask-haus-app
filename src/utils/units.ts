export const getSolPercentages = (
  percentages: number[],
  totalAmount: bigint
): bigint[] => {
  // Constants for Solidity precision
  const DECIMALS = 18;
  const SCALE = BigInt(10 ** DECIMALS);

  // Convert percentages to scaled integers with full precision
  // e.g., 50.5% becomes 505000000000000000000n (50.5 * 10^18)
  const scaledPercentages = percentages.map((percent) =>
    BigInt(Math.round((percent * Number(SCALE)) / 100))
  );

  // Calculate amounts maintaining precision
  const amounts = scaledPercentages.map(
    (scaledPercent) => (totalAmount * scaledPercent) / SCALE
  );

  // Handle any dust from rounding
  const distributedSum = amounts.reduce((acc, curr) => acc + curr, 0n);
  const dust = totalAmount - distributedSum;
  if (dust !== 0n) {
    // Add dust to the largest percentage allocation
    const maxIndex = percentages.indexOf(Math.max(...percentages));
    amounts[maxIndex] += dust;
  }

  return amounts;
};

// const testDistribution = () => {
//   const percentages = [50.5, 25.25, 24.25, 33.33333333333333]; // Must sum to 100
//   const oneEther = BigInt('1000000000000000000'); // 1 ether in wei

//   try {
//     const distributed = getSolPercentages(percentages, oneEther);
//     console.log('distributed', distributed);
//     // Log results
//     percentages.forEach((percent, i) => {
//       console.log(`${percent}% of ${oneEther} = ${distributed[i]} wei`);
//     });

//     // Verify total
//     const sum = distributed.reduce((acc, curr) => acc + curr, 0n);
//     console.log(`\nOriginal amount: ${oneEther} wei`);
//     console.log(`Sum of distributed amounts: ${sum} wei`);
//     console.log(`Difference: ${oneEther - sum} wei`);

//     // Verify each amount's percentage
//     distributed.forEach((amount, i) => {
//       const actualPercentage =
//         Number((amount * BigInt(10000)) / oneEther) / 100;
//       console.log(`Target: ${percentages[i]}%, Actual: ${actualPercentage}%`);
//     });
//   } catch (error: any) {
//     console.error('Error:', error.message);
//   }
// };

// testDistribution();
