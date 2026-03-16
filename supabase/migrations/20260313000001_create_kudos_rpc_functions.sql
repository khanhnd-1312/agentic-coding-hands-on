-- RPC functions for atomic counter operations on kudos and profiles
-- Used by POST/DELETE /api/kudos/[id]/like route handlers

-- Increment heart_count on a kudos row
CREATE OR REPLACE FUNCTION increment_heart_count(kudos_row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE kudos SET heart_count = heart_count + 1 WHERE id = kudos_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement heart_count on a kudos row (floor at 0)
CREATE OR REPLACE FUNCTION decrement_heart_count(kudos_row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE kudos SET heart_count = GREATEST(heart_count - 1, 0) WHERE id = kudos_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Award tim points to a user
CREATE OR REPLACE FUNCTION award_tim_points(target_user_id UUID, points INT)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET tim_points = tim_points + points WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke tim points from a user (floor at 0)
CREATE OR REPLACE FUNCTION revoke_tim_points(target_user_id UUID, points INT)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET tim_points = GREATEST(tim_points - points, 0) WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
