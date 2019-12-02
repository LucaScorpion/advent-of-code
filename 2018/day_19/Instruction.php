<?php

class Instruction
{
    public $name;
    public $a;
    public $b;
    public $c;

    public function __construct($op)
    {
        $opParts = explode(' ', $op);
        $this->name = $opParts[0];
        $this->a = (int)$opParts[1];
        $this->b = (int)$opParts[2];
        $this->c = (int)$opParts[3];
    }
}
