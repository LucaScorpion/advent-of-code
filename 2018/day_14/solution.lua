#!/usr/bin/env lua

local scoreAfter = io.read("*line")
local state = "37"
local elves = {}
local targetLength = #state + scoreAfter + 10

-- Load the initial state of the elves.
for i = 1, 2 do
    elves[i] = i
end

function getNewRecipes()
    -- Get the sum of all current scores.
    local sum = 0
    for i, pos in ipairs(elves) do
        sum = sum + state:sub(pos, pos)
    end

    -- Get the new recipe scores.
    local sumStr = tostring(math.floor(sum))
    for i = 1, #sumStr do
        state = state .. sumStr:sub(i, i)
    end
end

function step()
    getNewRecipes()

    -- Get the new positions.
    for i, pos in ipairs(elves) do
        local nextPos = pos + 1 + state:sub(pos, pos)
        while nextPos > #state do
            nextPos = nextPos - #state
        end
        elves[i] = nextPos
    end
end

while #state < targetLength do
    step()
end

print("Next 10 recipes: " .. state:sub(scoreAfter + 1, scoreAfter + 10))
