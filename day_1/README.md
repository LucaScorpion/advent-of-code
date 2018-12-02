### Usage

```bash
./solution.sh < input.txt
```

### Output

```
Resulting frequency: 430
Calibrated frequency: 462
Calibration took 144 additional iterations.
```

### Possible Improvements

The script first reads the entire input into an array before it starts processing.
This costs an extra iteration and restricts the use of infinite inputs.
