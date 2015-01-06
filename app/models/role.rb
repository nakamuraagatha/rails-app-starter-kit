# == Schema Information
#
# Table name: roles
#
#  id            :integer          not null, primary key
#  name          :string
#  resource_id   :integer
#  resource_type :string
#  created_at    :datetime
#  updated_at    :datetime
#  tenant_id     :integer          not null
#

# MY NOTE: Auto-generated by the 'rolify' gem's generator
class Role < ActiveRecord::Base
  # MY NOTE: Added for multi-tenancy
  acts_as_tenant :tenant

  has_and_belongs_to_many :users, join_table: :users_roles
  belongs_to :resource, polymorphic: true
  
  scopify
end
