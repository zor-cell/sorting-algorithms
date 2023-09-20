export function comparisonHook(initValue) {
    const [comparisons, setComparisons] = React.useState(initValue);
  
    return [comparisons, setComparisons];
  }