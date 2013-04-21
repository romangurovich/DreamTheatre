class Dream < ActiveRecord::Base
  attr_accessible :blurb, :theme_ids
  has_many :dream_themes
  has_many :themes, through: :dream_themes
end
