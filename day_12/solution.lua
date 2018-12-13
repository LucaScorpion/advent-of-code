#!/usr/bin/env lua

local state = io.read("*line"):sub(16)
local offset = 0
local spreads = {}

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
function getSum()
    local sum = 0

    for i = 1, #state do
        local pot = state:sub(i, i)

        -- Check for a plant.
        if pot == "#" then
            sum = sum + (i - 1) + offset -- Add the offset, account for i starting at 1.
        end
    end

    return sum
end

for gen = 1, 20 do
    nextState()

    if gen == 20 then
        print("Sum of plant-containing pot numbers (20 generations): " .. getSum())
    end
end
