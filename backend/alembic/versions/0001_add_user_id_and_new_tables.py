"""Add user_id and reset_token columns, create users and articles tables

Revision ID: 0001
Revises: 
Create Date: 2026-07-24

This migration brings the database schema in sync with the current
SQLAlchemy models. It handles the case where some tables already exist
(from create_all) but are missing newer columns like user_id.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- Create tables that may not exist yet ---
    
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.String(), server_default='farmer'),
        sa.Column('created_at', sa.DateTime()),
        sa.Column('reset_token', sa.String(), nullable=True),
        sa.Column('reset_token_expires', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        if_not_exists=True,
    )
    op.create_index('ix_users_id', 'users', ['id'], if_not_exists=True)
    op.create_index('ix_users_email', 'users', ['email'], unique=True, if_not_exists=True)
    op.create_index('ix_users_reset_token', 'users', ['reset_token'], if_not_exists=True)

    # Articles table
    op.create_table(
        'articles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('author', sa.String(), nullable=False),
        sa.Column('tags', sa.JSON()),
        sa.Column('created_at', sa.DateTime()),
        sa.PrimaryKeyConstraint('id'),
        if_not_exists=True,
    )
    op.create_index('ix_articles_id', 'articles', ['id'], if_not_exists=True)

    # --- Add missing columns to existing tables ---
    
    # Add user_id column to history_items (the column that caused the crash)
    op.add_column('history_items', sa.Column('user_id', sa.String(), nullable=True))
    op.create_foreign_key(
        'fk_history_items_user_id',
        'history_items', 'users',
        ['user_id'], ['id'],
    )


def downgrade() -> None:
    op.drop_constraint('fk_history_items_user_id', 'history_items', type_='foreignkey')
    op.drop_column('history_items', 'user_id')
    op.drop_table('articles')
    op.drop_table('users')
