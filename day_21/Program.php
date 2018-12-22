<?php

require_once 'Operations.php';

class Program
{
    private $ipRegister;
    private $instructions;

    private $ops;
    private $registers;
    private $pointer = 0;

    public function __construct(array $initReg, int $ipRegister, array $instructions)
    {
        $this->registers = $initReg;
        $this->ipRegister = $ipRegister;
        $this->instructions = $instructions;
        $this->ops = new Operations();
    }

    public function run()
    {
        $iCount = count($this->instructions);
        $reg3Vals = [];
        $firstR3Printed = false;

        while ($this->pointer >= 0 && $this->pointer < $iCount) {
            $this->registers[$this->ipRegister] = $this->pointer;

            // Run the instruction.
            $this->registers = $this->ops->execute(
                $this->registers,
                $this->instructions[$this->pointer]
            );

            // Check register 3 on instruction 28 (the comparison to register 0).
            if ($this->pointer === 28) {
                $r3 = $this->registers[3];
                if (in_array($r3, $reg3Vals)) {
                    break;
                }
                $reg3Vals[] = $r3;

                if (!$firstR3Printed) {
                    print "First value for register 3: {$reg3Vals[0]}\n";
                    $firstR3Printed = true;
                }
            }

            $this->pointer = $this->registers[$this->ipRegister] + 1;
        }

        print "Value for register 3 which causes longest run: " . $reg3Vals[count($reg3Vals) - 1] . "\n";
    }
}
