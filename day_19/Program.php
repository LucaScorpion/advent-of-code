<?php

require_once 'Operations.php';

class Program
{
    private $ipRegister;
    private $instructions;

    private $ops;
    private $registers = [0, 0, 0, 0, 0, 0];
    private $pointer = 0;

    public function __construct(int $ipRegister, array $instructions)
    {
        $this->ipRegister = $ipRegister;
        $this->instructions = $instructions;
        $this->ops = new Operations();
    }

    public function run()
    {
        $iCount = count($this->instructions);

        while ($this->pointer >= 0 && $this->pointer < $iCount) {
            $this->registers[$this->ipRegister] = $this->pointer;

            // Run the instruction.
            $this->registers = $this->ops->execute(
                $this->registers,
                $this->instructions[$this->pointer]
            );

            $this->pointer = $this->registers[$this->ipRegister] + 1;
        }

        print "Program halted, pointer is at: {$this->pointer}.\n";
        return $this->registers;
    }
}
