#!/usr/bin/env lua

local polymer = io.read("*all")

-- Check if two elements react.
function react(left, right)
    return left:lower() == right:lower() and left ~= right
end

local i = 1
while i < #polymer - 1 do
    if react(polymer:sub(i, i), polymer:sub(i + 1, i + 1)) then
        -- Remove the reacting components, reset to the previous char.
        polymer = polymer:sub(1, i - 1) .. polymer:sub(i + 2)
        i = i - 1
    else
        i = i + 1
    end
end

print("Resulting polymer length: " .. #polymer - 1)
