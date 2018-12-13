#!/usr/bin/env lua

local state = io.read("*line"):sub(16)
local offset = 0
local spreads = {}
local gen = 0

io.read("*line") -- Get rid of the empty line.
-- Read all the spread lines into the spreads table.
local line = io.read("*line")
while line ~= nil do
    local replace = line:sub(1, 5)
    local with = line:sub(10)
    spreads[replace] = with

    line = io.read("*line")
end

function nextState()
    -- Get the next state.
    local next = ""
    for i = -1, #state + 2 do
        next = next .. nextPotState(i)
    end

    -- Trim off the dead plants at the end.
    next = next:gsub("[\\.]+$", "")

    -- Calculate the new offset.
    local dOffset = -2
    while next:sub(1, 1) == "." do
        next = next:sub(2)
        dOffset = dOffset + 1
    end

    offset = offset + dOffset
    state = next
end

function nextPotState(index)
    -- Get the surrounding pots.
    local pots = ""
    for p = index - 2, index + 2 do
        if p < 1 or p > #state then
            pots = pots .. "."
        else
            pots = pots .. state:sub(p, p)
        end
    end

    -- Check for a next state.
    local replace = spreads[pots]
    if replace ~= nil then
        return replace
    end

    return "."
end

-- Calculate the sum of all numbers of the pots that contain plants (#).
function printSum()
    local sum = 0

    for i = 1, #state do
        local pot = state:sub(i, i)

        -- Check for a plant.
        if pot == "#" then
            sum = sum + (i - 1) + offset -- Add the offset, account for i starting at 1.
        end
    end

    print("Sum of plant-containing pot numbers (" .. gen .. " generations): " .. sum)
end

-- Pattern to {offset, gen}.
local patterns = {
    state = {
        ["gen"] = 0,
        ["offset"] = 0
    }
}

-- Try to find a pattern.
local foundPattern = nil
while foundPattern == nil do
    nextState()
    gen = gen + 1

    -- For part 1.
    if gen == 20 then
        printSum()
    end

    foundPattern = patterns[state]
    if foundPattern == nil then
        patterns[state] = {
            ["gen"] = gen,
            ["offset"] = offset
        }
    end
end

-- Get the pattern info.
local patternLength = gen - foundPattern["gen"]
local patternOffset = offset - foundPattern["offset"]
print("Found a pattern of length " .. patternLength .. " after " .. gen .. " generations.")

-- Skip ahead a few generations.
local targetGen = 50000000000
local left = (targetGen - gen) % patternLength
local newGen =  targetGen - left
local repeats = (newGen - gen) / patternLength
gen = newGen
offset = offset + repeats * patternOffset
print("Repeated the pattern " .. repeats .. " times.")

-- Finish what's left.
while gen < targetGen do
    nextState()
    gen = gen + 1
end
printSum()
