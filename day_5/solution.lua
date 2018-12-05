#!/usr/bin/env lua

-- Read the polymer, remove whitespaces.
local originalPolymer = io.read("*all"):gsub("%s", "")
print("Original polymer length: " .. originalPolymer:len())

-- Check if two units react.
function unitsReact(left, right)
    return left:lower() == right:lower() and left ~= right
end

function react(original)
    local polymer = original

    local i = 1
    while i < polymer:len() do
        if unitsReact(polymer:sub(i, i), polymer:sub(i + 1, i + 1)) then
            -- Remove the reacting components, reset to the previous char.
            polymer = polymer:sub(1, i - 1) .. polymer:sub(i + 2)
            i = i - 1
        else
            i = i + 1
        end
    end

    return polymer
end

local reactedPolymer = react(originalPolymer)
print("Polymer length after reactions: " .. reactedPolymer:len())

-- Remove all instances of a unit from a polymer.
function removeUnit(original, unit)
    return original:gsub("[" .. unit:lower() .. unit:upper() .. "]", "")
end

local shortestPolymerLength = reactedPolymer:len()

-- ASCII a to z.
for i = 97, 122 do
    -- Remove the unit and react the resulting polymer.
    local char = string.char(i)
    local p = removeUnit(originalPolymer, char)
    local pLen = react(p):len()

    if pLen < shortestPolymerLength then
        shortestPolymerLength = pLen
    end
end

print("Shortest polymer length after unit removal: " .. shortestPolymerLength)
