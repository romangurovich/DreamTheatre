class Theme < ActiveRecord::Base
  attr_accessible :trope
  has_many :dream_themes
  has_many :dreams, through: :dream_themes
end
