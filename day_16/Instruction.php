<?php

class Instruction
{
    public $code;
    public $a;
    public $b;
    public $c;

    public function __construct($op)
    {
        $opParts = explode(' ', $op);
        $this->code = $opParts[0];
        $this->a = (int)$opParts[1];
        $this->b = (int)$opParts[2];
        $this->c = (int)$opParts[3];
    }
}
